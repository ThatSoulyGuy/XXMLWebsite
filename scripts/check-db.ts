import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const modules = await prisma.docModule.findMany({
    include: { classes: true },
  });
  console.log("Modules in database:");
  console.log(JSON.stringify(modules, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
