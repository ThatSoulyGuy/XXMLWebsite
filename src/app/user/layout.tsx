import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserNav } from "./user-nav";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <UserNav />
      {children}
    </div>
  );
}
