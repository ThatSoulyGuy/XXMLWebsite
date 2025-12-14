"use server";

import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { loginSchema, signupSchema } from "@/lib/validations/auth";
import { AuthError } from "next-auth";

export async function login(prevState: { error: string | null }, formData: FormData) {
  const validated = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { error: "Invalid email or password" };
  }

  try {
    await signIn("credentials", {
      ...validated.data,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }

  return { error: null };
}

export async function signup(prevState: { error: string | null }, formData: FormData) {
  const validated = signupSchema.safeParse({
    name: formData.get("name"),
    handle: formData.get("handle"),
    email: formData.get("email"),
    gender: formData.get("gender"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { name, handle, email, gender, password } = validated.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already in use" };
  }

  const existingHandle = await prisma.user.findUnique({
    where: { username: handle },
  });

  if (existingHandle) {
    return { error: "Handle already taken" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      username: handle,
      gender,
    },
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/",
  });

  return { error: null };
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}

export async function oauthSignIn(provider: "github" | "google") {
  await signIn(provider, { redirectTo: "/" });
}
