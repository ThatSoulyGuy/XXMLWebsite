import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Find user by name
  const user = await prisma.user.findFirst({
    where: {
      name: {
        contains: "Eric Edward Phillips",
      },
    },
  });

  if (!user) {
    console.log("User 'Eric Edward Phillips' not found.");
    console.log("\nExisting users:");
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
    console.log(users);
    return;
  }

  console.log("Found user:", user.name, user.email);
  console.log("Current role:", user.role);

  // Promote to admin
  await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN" },
  });

  console.log("Promoted to ADMIN successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
