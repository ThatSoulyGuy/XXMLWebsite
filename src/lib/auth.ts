import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      role: string;
      username: string | null;
    };
  }

  interface User {
    role: string;
    username: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: string;
    username: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as never,
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/user.birthday.read",
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          username: user.username,
        };
      },
    }),
  ],
  events: {
    // Fetch Google data after account is linked (user already exists in DB)
    async linkAccount({ user, account }) {
      if (account.provider === "google" && account.access_token) {
        try {
          const response = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=genders,birthdays",
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();

            // Process gender
            const gender = data.genders?.[0]?.value?.toUpperCase();
            const genderMap: Record<string, string> = {
              MALE: "MALE",
              FEMALE: "FEMALE",
              OTHER: "OTHER",
            };
            const mappedGender = gender ? (genderMap[gender] || "PREFER_NOT_TO_SAY") : null;

            // Process birthday
            const birthday = data.birthdays?.find((b: { metadata?: { source?: { type?: string } }; date?: { year?: number; month?: number; day?: number } }) =>
              b.metadata?.source?.type === "ACCOUNT" || b.metadata?.source?.type === "PROFILE"
            )?.date;

            let birthdate: Date | null = null;
            if (birthday?.year && birthday?.month && birthday?.day) {
              birthdate = new Date(birthday.year, birthday.month - 1, birthday.day);
            }

            // Update user with gender and birthdate
            if (mappedGender || birthdate) {
              await prisma.user.update({
                where: { id: user.id },
                data: {
                  ...(mappedGender && { gender: mappedGender }),
                  ...(birthdate && { birthdate }),
                },
              });
            }
          }
        } catch (error) {
          console.error("Failed to fetch user data from Google:", error);
        }
      }
    },
  },
  callbacks: {
    async jwt({ token, user, trigger, account }) {
      // Set initial values from user object (credentials login)
      if (user) {
        token.role = user.role || "USER";
        token.username = user.username || null;
      }

      // For OAuth users, fetch from DB on first sign in
      if (account && token.sub) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true, username: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.username = dbUser.username;
          }
        } catch {
          // Ignore errors (might be in Edge runtime)
        }
      }

      // Refresh on explicit update trigger or when username is missing (after onboarding)
      if ((trigger === "update" || !token.username) && token.sub) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true, username: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.username = dbUser.username;
          }
        } catch {
          // Ignore errors (might be in Edge runtime)
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = (token.role as string) || "USER";
        session.user.username = (token.username as string | null) || null;
      }
      return session;
    },
  },
});
