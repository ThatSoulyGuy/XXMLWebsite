-- CreateTable
CREATE TABLE "DocModule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "importPath" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DocClass" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "constraints" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "moduleId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DocClass_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "DocModule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DocMethod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Methods',
    "params" TEXT NOT NULL,
    "returns" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "classId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DocMethod_classId_fkey" FOREIGN KEY ("classId") REFERENCES "DocClass" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DocExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "code" TEXT NOT NULL,
    "filename" TEXT,
    "showLines" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "classId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DocExample_classId_fkey" FOREIGN KEY ("classId") REFERENCES "DocClass" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DocModule_slug_key" ON "DocModule"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DocClass_moduleId_slug_key" ON "DocClass"("moduleId", "slug");

-- CreateIndex
CREATE INDEX "DocMethod_classId_idx" ON "DocMethod"("classId");

-- CreateIndex
CREATE INDEX "DocExample_classId_idx" ON "DocExample"("classId");
