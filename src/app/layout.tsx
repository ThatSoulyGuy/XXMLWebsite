import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RoleThemeWrapper } from "@/components/layout/role-theme-wrapper";
import { ToastProvider } from "@/components/ui/toast";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "XXML - A Modern Compiled Programming Language",
    template: "%s | XXML",
  },
  description:
    "XXML is a compiled programming language with LLVM backend, explicit ownership semantics, and powerful generics.",
  keywords: ["XXML", "programming language", "compiler", "LLVM", "ownership", "generics"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  let userRole: "USER" | "DEVELOPER" | "MODERATOR" | "ADMIN" = "USER";
  let notifications: { id: string; message: string; type: string; read: boolean; createdAt: Date }[] = [];

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (user?.role) {
      userRole = user.role as typeof userRole;
    }

    // Fetch unread notifications
    notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider>
          <RoleThemeWrapper role={userRole}>
            <div className="flex min-h-screen flex-col">
              <Header user={session?.user} role={userRole} notifications={notifications} />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </RoleThemeWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
