"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { z } from "zod";
import {
  requireRole,
  handleSecurityError,
  ROLES,
  validateId,
} from "@/lib/security";

async function requireDeveloperRole() {
  try {
    const user = await requireRole(ROLES.DEVELOPERS);
    return { error: null, user };
  } catch {
    return { error: "You do not have permission to edit documentation", user: null };
  }
}

// ===== PUBLIC READ OPERATIONS =====

export async function getModules() {
  return prisma.docModule.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      classes: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  });
}

export async function getModuleBySlug(slug: string) {
  return prisma.docModule.findUnique({
    where: { slug },
    include: {
      classes: {
        orderBy: { sortOrder: "asc" },
        include: {
          methods: { orderBy: { sortOrder: "asc" } },
          examples: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });
}

export async function getClassBySlug(moduleSlug: string, classSlug: string) {
  const module = await prisma.docModule.findUnique({
    where: { slug: moduleSlug },
    select: { id: true, name: true, slug: true },
  });

  if (!module) return null;

  const docClass = await prisma.docClass.findUnique({
    where: {
      moduleId_slug: {
        moduleId: module.id,
        slug: classSlug,
      },
    },
    include: {
      module: {
        select: { id: true, name: true, slug: true, importPath: true },
      },
      methods: { orderBy: { sortOrder: "asc" } },
      examples: { orderBy: { sortOrder: "asc" } },
    },
  });

  return docClass;
}

export async function getClassesByModule(moduleSlug: string) {
  const module = await prisma.docModule.findUnique({
    where: { slug: moduleSlug },
    select: { id: true },
  });

  if (!module) return [];

  return prisma.docClass.findMany({
    where: { moduleId: module.id },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
    },
  });
}

// ===== MODULE CRUD =====

const moduleSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100),
  description: z.string().min(1, "Description is required"),
  importPath: z.string().min(1, "Import path is required"),
  sortOrder: z.number().int().default(0),
});

export async function createModule(data: z.infer<typeof moduleSchema>) {
  const { error } = await requireDeveloperRole();
  if (error) return { error };

  const validated = moduleSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const existing = await prisma.docModule.findUnique({
    where: { slug: validated.data.slug },
  });
  if (existing) {
    return { error: "A module with this slug already exists" };
  }

  const module = await prisma.docModule.create({
    data: validated.data,
  });

  revalidatePath("/docs/standard-library");
  return { error: null, module };
}

export async function updateModule(id: string, data: Partial<z.infer<typeof moduleSchema>>) {
  const { error } = await requireDeveloperRole();
  if (error) return { error };

  const module = await prisma.docModule.update({
    where: { id },
    data,
  });

  revalidatePath("/docs/standard-library");
  return { error: null, module };
}

export async function deleteModule(id: string) {
  const { error } = await requireDeveloperRole();
  if (error) return { error };

  await prisma.docModule.delete({ where: { id } });

  revalidatePath("/docs/standard-library");
  return { error: null };
}

// ===== CLASS CRUD =====

const methodSchema = z.object({
  name: z.string().min(1),
  category: z.string().default("Methods"),
  params: z.string(),
  returns: z.string(),
  description: z.string(),
  sortOrder: z.number().int().default(0),
});

const exampleSchema = z.object({
  title: z.string().optional(),
  code: z.string().min(1),
  filename: z.string().optional(),
  showLines: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

const classSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100),
  description: z.string().min(1, "Description is required"),
  constraints: z.string().optional(),
  sortOrder: z.number().int().default(0),
  moduleId: z.string().min(1, "Module is required"),
  methods: z.array(methodSchema).default([]),
  examples: z.array(exampleSchema).default([]),
});

export async function createClass(data: z.infer<typeof classSchema>) {
  const { error } = await requireDeveloperRole();
  if (error) return { error };

  const validated = classSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { methods, examples, ...classData } = validated.data;

  const existing = await prisma.docClass.findUnique({
    where: {
      moduleId_slug: {
        moduleId: classData.moduleId,
        slug: classData.slug,
      },
    },
  });
  if (existing) {
    return { error: "A class with this slug already exists in this module" };
  }

  const docClass = await prisma.docClass.create({
    data: {
      ...classData,
      methods: {
        create: methods,
      },
      examples: {
        create: examples,
      },
    },
    include: {
      methods: true,
      examples: true,
    },
  });

  revalidatePath("/docs/standard-library");
  return { error: null, class: docClass };
}

export async function updateClass(
  id: string,
  data: Partial<Omit<z.infer<typeof classSchema>, "moduleId">> & {
    methods?: z.infer<typeof methodSchema>[];
    examples?: z.infer<typeof exampleSchema>[];
  }
) {
  const { error } = await requireDeveloperRole();
  if (error) return { error };

  const { methods, examples, ...classData } = data;

  // Update class and replace methods/examples
  const docClass = await prisma.$transaction(async (tx) => {
    // Update basic class data
    await tx.docClass.update({
      where: { id },
      data: classData,
    });

    // If methods provided, delete existing and create new
    if (methods !== undefined) {
      await tx.docMethod.deleteMany({ where: { classId: id } });
      if (methods.length > 0) {
        await tx.docMethod.createMany({
          data: methods.map((m) => ({ ...m, classId: id })),
        });
      }
    }

    // If examples provided, delete existing and create new
    if (examples !== undefined) {
      await tx.docExample.deleteMany({ where: { classId: id } });
      if (examples.length > 0) {
        await tx.docExample.createMany({
          data: examples.map((e) => ({ ...e, classId: id })),
        });
      }
    }

    return tx.docClass.findUnique({
      where: { id },
      include: {
        methods: { orderBy: { sortOrder: "asc" } },
        examples: { orderBy: { sortOrder: "asc" } },
      },
    });
  });

  revalidatePath("/docs/standard-library");
  return { error: null, class: docClass };
}

export async function deleteClass(id: string) {
  const { error } = await requireDeveloperRole();
  if (error) return { error };

  await prisma.docClass.delete({ where: { id } });

  revalidatePath("/docs/standard-library");
  return { error: null };
}

// ===== UTILITY =====

export async function reorderModules(orderedIds: string[]) {
  const { error } = await requireDeveloperRole();
  if (error) return { error };

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.docModule.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );

  revalidatePath("/docs/standard-library");
  return { error: null };
}

export async function reorderClasses(moduleId: string, orderedIds: string[]) {
  const { error } = await requireDeveloperRole();
  if (error) return { error };

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.docClass.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );

  revalidatePath("/docs/standard-library");
  return { error: null };
}
