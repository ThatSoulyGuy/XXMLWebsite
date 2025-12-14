/**
 * Data Migration Script for Documentation CMS
 *
 * This script seeds the database with the standard library documentation
 * extracted from the static TSX pages.
 *
 * Run with: npx tsx scripts/migrate-docs.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Method {
  name: string;
  category: string;
  params: string;
  returns: string;
  description: string;
}

interface Example {
  title?: string;
  code: string;
  filename?: string;
  showLines: boolean;
}

interface ClassData {
  name: string;
  slug: string;
  description: string;
  constraints?: string;
  methods: Method[];
  examples: Example[];
}

interface ModuleData {
  name: string;
  slug: string;
  description: string;
  importPath: string;
  classes: ClassData[];
}

// Core Module Data
const coreModule: ModuleData = {
  name: "Core",
  slug: "core",
  description: "The Core module provides fundamental types that form the foundation of XXML programming.",
  importPath: "#import Language::Core;",
  classes: [
    {
      name: "Integer",
      slug: "integer",
      description: "64-bit signed integer type with full arithmetic and comparison operations.",
      methods: [
        { name: "Constructor", category: "Constructors", params: "", returns: "Integer", description: "Create default integer (0)" },
        { name: "Constructor", category: "Constructors", params: "value: Integer", returns: "Integer^", description: "Create from literal value" },
        { name: "add", category: "Arithmetic", params: "other: Integer&", returns: "Integer^", description: "Addition" },
        { name: "subtract", category: "Arithmetic", params: "other: Integer&", returns: "Integer^", description: "Subtraction" },
        { name: "multiply", category: "Arithmetic", params: "other: Integer&", returns: "Integer^", description: "Multiplication" },
        { name: "divide", category: "Arithmetic", params: "other: Integer&", returns: "Integer^", description: "Integer division" },
        { name: "modulo", category: "Arithmetic", params: "other: Integer&", returns: "Integer^", description: "Remainder" },
        { name: "negate", category: "Arithmetic", params: "", returns: "Integer^", description: "Negation" },
        { name: "equals", category: "Comparison", params: "other: Integer&", returns: "Bool^", description: "Equality check" },
        { name: "lessThan", category: "Comparison", params: "other: Integer&", returns: "Bool^", description: "Less than" },
        { name: "greaterThan", category: "Comparison", params: "other: Integer&", returns: "Bool^", description: "Greater than" },
        { name: "lessOrEqual", category: "Comparison", params: "other: Integer&", returns: "Bool^", description: "Less or equal" },
        { name: "greaterOrEqual", category: "Comparison", params: "other: Integer&", returns: "Bool^", description: "Greater or equal" },
        { name: "toString", category: "Conversion", params: "", returns: "String^", description: "Convert to string" },
        { name: "toDouble", category: "Conversion", params: "", returns: "Double^", description: "Convert to double" },
        { name: "abs", category: "Utility", params: "", returns: "Integer^", description: "Absolute value" },
        { name: "hash", category: "Utility", params: "", returns: "Integer^", description: "Hash code" },
      ],
      examples: [
        {
          code: `Instantiate Integer^ As <x> = Integer::Constructor(42);
Instantiate Integer^ As <y> = Integer::Constructor(10);

Instantiate Integer^ As <sum> = x.add(y);
Run System::Console::printLine(sum.toString());  // 52

If (x.greaterThan(y).toBool())
{
    Run System::Console::printLine(String::Constructor("x is greater"));
}`,
          showLines: false,
        },
      ],
    },
    {
      name: "Double",
      slug: "double",
      description: "64-bit floating-point type for decimal arithmetic with full IEEE 754 support.",
      methods: [
        { name: "Constructor", category: "Constructors", params: "", returns: "Double", description: "Create default (0.0)" },
        { name: "Constructor", category: "Constructors", params: "value: Double", returns: "Double^", description: "Create from literal" },
        { name: "add", category: "Arithmetic", params: "other: Double&", returns: "Double^", description: "Addition" },
        { name: "subtract", category: "Arithmetic", params: "other: Double&", returns: "Double^", description: "Subtraction" },
        { name: "multiply", category: "Arithmetic", params: "other: Double&", returns: "Double^", description: "Multiplication" },
        { name: "divide", category: "Arithmetic", params: "other: Double&", returns: "Double^", description: "Division" },
        { name: "negate", category: "Arithmetic", params: "", returns: "Double^", description: "Negation" },
        { name: "equals", category: "Comparison", params: "other: Double&", returns: "Bool^", description: "Equality" },
        { name: "lessThan", category: "Comparison", params: "other: Double&", returns: "Bool^", description: "Less than" },
        { name: "greaterThan", category: "Comparison", params: "other: Double&", returns: "Bool^", description: "Greater than" },
        { name: "toString", category: "Conversion", params: "", returns: "String^", description: "Convert to string" },
        { name: "toInteger", category: "Conversion", params: "", returns: "Integer^", description: "Truncate to integer" },
        { name: "floor", category: "Utility", params: "", returns: "Double^", description: "Round down" },
        { name: "ceil", category: "Utility", params: "", returns: "Double^", description: "Round up" },
        { name: "round", category: "Utility", params: "", returns: "Double^", description: "Round to nearest" },
        { name: "abs", category: "Utility", params: "", returns: "Double^", description: "Absolute value" },
      ],
      examples: [],
    },
    {
      name: "Bool",
      slug: "bool",
      description: "Boolean type representing true/false values with logical operations.",
      methods: [
        { name: "Constructor", category: "Constructors", params: "", returns: "Bool", description: "Create default (false)" },
        { name: "Constructor", category: "Constructors", params: "value: Bool", returns: "Bool^", description: "Create from literal" },
        { name: "and", category: "Logical", params: "other: Bool&", returns: "Bool^", description: "Logical AND" },
        { name: "or", category: "Logical", params: "other: Bool&", returns: "Bool^", description: "Logical OR" },
        { name: "not", category: "Logical", params: "", returns: "Bool^", description: "Logical NOT" },
        { name: "equals", category: "Comparison", params: "other: Bool&", returns: "Bool^", description: "Equality" },
        { name: "toBool", category: "Conversion", params: "", returns: "bool", description: "Convert to native bool" },
        { name: "toString", category: "Conversion", params: "", returns: "String^", description: "\"true\" or \"false\"" },
      ],
      examples: [],
    },
    {
      name: "String",
      slug: "string",
      description: "Immutable UTF-8 string type with comprehensive text manipulation operations.",
      methods: [
        { name: "Constructor", category: "Constructors", params: "", returns: "String", description: "Create empty string" },
        { name: "Constructor", category: "Constructors", params: "value: String", returns: "String^", description: "Create from literal" },
        { name: "length", category: "Properties", params: "", returns: "Integer^", description: "Character count" },
        { name: "isEmpty", category: "Properties", params: "", returns: "Bool^", description: "Check if empty" },
        { name: "append", category: "Operations", params: "other: String&", returns: "String^", description: "Concatenate strings" },
        { name: "charAt", category: "Operations", params: "index: Integer&", returns: "String^", description: "Get character at index" },
        { name: "substring", category: "Operations", params: "start: Integer&, length: Integer&", returns: "String^", description: "Extract substring" },
        { name: "contains", category: "Search", params: "substr: String&", returns: "Bool^", description: "Check if contains" },
        { name: "startsWith", category: "Search", params: "prefix: String&", returns: "Bool^", description: "Check prefix" },
        { name: "endsWith", category: "Search", params: "suffix: String&", returns: "Bool^", description: "Check suffix" },
        { name: "indexOf", category: "Search", params: "substr: String&", returns: "Integer^", description: "Find first occurrence" },
        { name: "toUpperCase", category: "Transform", params: "", returns: "String^", description: "Convert to uppercase" },
        { name: "toLowerCase", category: "Transform", params: "", returns: "String^", description: "Convert to lowercase" },
        { name: "trim", category: "Transform", params: "", returns: "String^", description: "Remove whitespace" },
        { name: "replace", category: "Transform", params: "old: String&, new: String&", returns: "String^", description: "Replace occurrences" },
        { name: "split", category: "Transform", params: "delimiter: String&", returns: "List<String>^", description: "Split into list" },
        { name: "equals", category: "Comparison", params: "other: String&", returns: "Bool^", description: "Equality check" },
        { name: "compareTo", category: "Comparison", params: "other: String&", returns: "Integer^", description: "Lexicographic compare" },
        { name: "hash", category: "Utility", params: "", returns: "Integer^", description: "Hash code" },
      ],
      examples: [],
    },
    {
      name: "None",
      slug: "none",
      description: "Unit type representing the absence of a value, used for void returns.",
      methods: [
        { name: "Constructor", category: "Constructors", params: "", returns: "None^", description: "Create None instance" },
        { name: "toString", category: "Methods", params: "", returns: "String^", description: "Returns \"None\"" },
      ],
      examples: [],
    },
  ],
};

// Collections Module Data
const collectionsModule: ModuleData = {
  name: "Collections",
  slug: "collections",
  description: "Generic collection types for storing and manipulating groups of elements.",
  importPath: "#import Language::Collections;",
  classes: [
    {
      name: "List<T>",
      slug: "list-t",
      description: "Dynamic array with automatic resizing and index-based access.",
      constraints: "T: Any",
      methods: [
        { name: "Constructor", category: "Constructors", params: "", returns: "List<T>", description: "Create empty list" },
        { name: "size", category: "Properties", params: "", returns: "Integer^", description: "Element count" },
        { name: "isEmpty", category: "Properties", params: "", returns: "Bool^", description: "Check if empty" },
        { name: "add", category: "Modification", params: "element: T^", returns: "None", description: "Add to end" },
        { name: "insert", category: "Modification", params: "index: Integer&, element: T^", returns: "None", description: "Insert at index" },
        { name: "remove", category: "Modification", params: "index: Integer&", returns: "T^", description: "Remove at index" },
        { name: "clear", category: "Modification", params: "", returns: "None", description: "Remove all elements" },
        { name: "get", category: "Access", params: "index: Integer&", returns: "T&", description: "Get by reference" },
        { name: "set", category: "Access", params: "index: Integer&, element: T^", returns: "None", description: "Set at index" },
        { name: "first", category: "Access", params: "", returns: "T&", description: "First element" },
        { name: "last", category: "Access", params: "", returns: "T&", description: "Last element" },
        { name: "contains", category: "Search", params: "element: T&", returns: "Bool^", description: "Check if contains" },
        { name: "indexOf", category: "Search", params: "element: T&", returns: "Integer^", description: "Find index (-1 if not found)" },
      ],
      examples: [],
    },
    {
      name: "Map<K, V>",
      slug: "map-k-v",
      description: "Hash-based key-value store with O(1) average access time.",
      constraints: "K: Hashable, Equatable",
      methods: [
        { name: "Constructor", category: "Constructors", params: "", returns: "Map<K,V>", description: "Create empty map" },
        { name: "size", category: "Properties", params: "", returns: "Integer^", description: "Key-value pair count" },
        { name: "isEmpty", category: "Properties", params: "", returns: "Bool^", description: "Check if empty" },
        { name: "put", category: "Modification", params: "key: K^, value: V^", returns: "None", description: "Insert or update" },
        { name: "remove", category: "Modification", params: "key: K&", returns: "V^", description: "Remove by key" },
        { name: "clear", category: "Modification", params: "", returns: "None", description: "Remove all entries" },
        { name: "get", category: "Access", params: "key: K&", returns: "V&", description: "Get value by key" },
        { name: "containsKey", category: "Search", params: "key: K&", returns: "Bool^", description: "Check key exists" },
        { name: "containsValue", category: "Search", params: "value: V&", returns: "Bool^", description: "Check value exists" },
        { name: "keys", category: "Iteration", params: "", returns: "List<K>^", description: "Get all keys" },
        { name: "values", category: "Iteration", params: "", returns: "List<V>^", description: "Get all values" },
      ],
      examples: [],
    },
    {
      name: "Set<T>",
      slug: "set-t",
      description: "Hash-based collection of unique elements with fast membership testing.",
      constraints: "T: Hashable, Equatable",
      methods: [
        { name: "Constructor", category: "Constructors", params: "", returns: "Set<T>", description: "Create empty set" },
        { name: "size", category: "Properties", params: "", returns: "Integer^", description: "Element count" },
        { name: "isEmpty", category: "Properties", params: "", returns: "Bool^", description: "Check if empty" },
        { name: "add", category: "Modification", params: "element: T^", returns: "Bool^", description: "Add element (returns true if added)" },
        { name: "remove", category: "Modification", params: "element: T&", returns: "Bool^", description: "Remove element" },
        { name: "clear", category: "Modification", params: "", returns: "None", description: "Remove all elements" },
        { name: "contains", category: "Search", params: "element: T&", returns: "Bool^", description: "Check membership" },
        { name: "union", category: "Set Operations", params: "other: Set<T>&", returns: "Set<T>^", description: "Union of sets" },
        { name: "intersection", category: "Set Operations", params: "other: Set<T>&", returns: "Set<T>^", description: "Intersection" },
        { name: "difference", category: "Set Operations", params: "other: Set<T>&", returns: "Set<T>^", description: "Difference" },
        { name: "toList", category: "Conversion", params: "", returns: "List<T>^", description: "Convert to list" },
      ],
      examples: [],
    },
    {
      name: "Queue<T>",
      slug: "queue-t",
      description: "FIFO (first-in, first-out) queue for ordered processing.",
      constraints: "T: Any",
      methods: [
        { name: "Constructor", category: "Constructors", params: "", returns: "Queue<T>", description: "Create empty queue" },
        { name: "size", category: "Properties", params: "", returns: "Integer^", description: "Element count" },
        { name: "isEmpty", category: "Properties", params: "", returns: "Bool^", description: "Check if empty" },
        { name: "enqueue", category: "Operations", params: "element: T^", returns: "None", description: "Add to back" },
        { name: "dequeue", category: "Operations", params: "", returns: "T^", description: "Remove from front" },
        { name: "peek", category: "Operations", params: "", returns: "T&", description: "View front element" },
        { name: "clear", category: "Operations", params: "", returns: "None", description: "Remove all elements" },
      ],
      examples: [],
    },
    {
      name: "Stack<T>",
      slug: "stack-t",
      description: "LIFO (last-in, first-out) stack for nested operations.",
      constraints: "T: Any",
      methods: [
        { name: "Constructor", category: "Constructors", params: "", returns: "Stack<T>", description: "Create empty stack" },
        { name: "size", category: "Properties", params: "", returns: "Integer^", description: "Element count" },
        { name: "isEmpty", category: "Properties", params: "", returns: "Bool^", description: "Check if empty" },
        { name: "push", category: "Operations", params: "element: T^", returns: "None", description: "Push to top" },
        { name: "pop", category: "Operations", params: "", returns: "T^", description: "Pop from top" },
        { name: "peek", category: "Operations", params: "", returns: "T&", description: "View top element" },
        { name: "clear", category: "Operations", params: "", returns: "None", description: "Remove all elements" },
      ],
      examples: [],
    },
  ],
};

// System Module Data
const systemModule: ModuleData = {
  name: "System",
  slug: "system",
  description: "System-level operations including console I/O, file operations, and environment access.",
  importPath: "#import Language::System;",
  classes: [
    {
      name: "Console",
      slug: "console",
      description: "Standard input/output operations for terminal interaction.",
      methods: [
        { name: "print", category: "Output", params: "message: String&", returns: "None", description: "Print without newline" },
        { name: "printLine", category: "Output", params: "message: String&", returns: "None", description: "Print with newline" },
        { name: "readLine", category: "Input", params: "", returns: "String^", description: "Read line from stdin" },
        { name: "readInt", category: "Input", params: "", returns: "Integer^", description: "Read and parse integer" },
        { name: "readDouble", category: "Input", params: "", returns: "Double^", description: "Read and parse double" },
        { name: "clear", category: "Control", params: "", returns: "None", description: "Clear console screen" },
      ],
      examples: [],
    },
    {
      name: "File",
      slug: "file",
      description: "File system operations for reading and writing files.",
      methods: [
        { name: "Constructor", category: "Constructors", params: "path: String^", returns: "File^", description: "Create file handle" },
        { name: "exists", category: "Properties", params: "", returns: "Bool^", description: "Check if file exists" },
        { name: "isDirectory", category: "Properties", params: "", returns: "Bool^", description: "Check if directory" },
        { name: "size", category: "Properties", params: "", returns: "Integer^", description: "Get file size in bytes" },
        { name: "read", category: "Operations", params: "", returns: "String^", description: "Read entire file" },
        { name: "write", category: "Operations", params: "content: String&", returns: "Bool^", description: "Write/overwrite file" },
        { name: "append", category: "Operations", params: "content: String&", returns: "Bool^", description: "Append to file" },
        { name: "delete", category: "Operations", params: "", returns: "Bool^", description: "Delete file" },
        { name: "copy", category: "Operations", params: "destination: String&", returns: "Bool^", description: "Copy file" },
        { name: "move", category: "Operations", params: "destination: String&", returns: "Bool^", description: "Move/rename file" },
        { name: "readLines", category: "Operations", params: "", returns: "List<String>^", description: "Read as lines" },
        { name: "listDirectory", category: "Directory", params: "", returns: "List<String>^", description: "List directory contents (static)" },
        { name: "createDirectory", category: "Directory", params: "", returns: "Bool^", description: "Create directory (static)" },
      ],
      examples: [],
    },
    {
      name: "Environment",
      slug: "environment",
      description: "Access to environment variables and system properties.",
      methods: [
        { name: "get", category: "Variables", params: "name: String&", returns: "String^", description: "Get environment variable" },
        { name: "set", category: "Variables", params: "name: String&, value: String&", returns: "Bool^", description: "Set environment variable" },
        { name: "getAll", category: "Variables", params: "", returns: "Map<String, String>^", description: "Get all variables" },
        { name: "getCurrentDirectory", category: "Paths", params: "", returns: "String^", description: "Current working directory" },
        { name: "getHomeDirectory", category: "Paths", params: "", returns: "String^", description: "User home directory" },
        { name: "getTempDirectory", category: "Paths", params: "", returns: "String^", description: "System temp directory" },
        { name: "getOsName", category: "System", params: "", returns: "String^", description: "Operating system name" },
        { name: "getOsVersion", category: "System", params: "", returns: "String^", description: "OS version" },
        { name: "getProcessorCount", category: "System", params: "", returns: "Integer^", description: "CPU core count" },
      ],
      examples: [],
    },
  ],
};

// All modules to migrate
const modules: ModuleData[] = [
  coreModule,
  collectionsModule,
  systemModule,
];

async function main() {
  console.log("Starting documentation migration...\n");

  for (let i = 0; i < modules.length; i++) {
    const moduleData = modules[i];
    console.log(`Creating module: ${moduleData.name}`);

    // Create or update module
    const module = await prisma.docModule.upsert({
      where: { slug: moduleData.slug },
      create: {
        name: moduleData.name,
        slug: moduleData.slug,
        description: moduleData.description,
        importPath: moduleData.importPath,
        sortOrder: i,
      },
      update: {
        name: moduleData.name,
        description: moduleData.description,
        importPath: moduleData.importPath,
        sortOrder: i,
      },
    });

    // Create classes
    for (let j = 0; j < moduleData.classes.length; j++) {
      const classData = moduleData.classes[j];
      console.log(`  Creating class: ${classData.name}`);

      // Check if class exists
      const existingClass = await prisma.docClass.findUnique({
        where: {
          moduleId_slug: {
            moduleId: module.id,
            slug: classData.slug,
          },
        },
      });

      if (existingClass) {
        // Delete existing methods and examples
        await prisma.docMethod.deleteMany({ where: { classId: existingClass.id } });
        await prisma.docExample.deleteMany({ where: { classId: existingClass.id } });

        // Update class
        await prisma.docClass.update({
          where: { id: existingClass.id },
          data: {
            name: classData.name,
            description: classData.description,
            constraints: classData.constraints,
            sortOrder: j,
          },
        });

        // Create methods
        if (classData.methods.length > 0) {
          await prisma.docMethod.createMany({
            data: classData.methods.map((m, k) => ({
              classId: existingClass.id,
              name: m.name,
              category: m.category,
              params: m.params,
              returns: m.returns,
              description: m.description,
              sortOrder: k,
            })),
          });
        }

        // Create examples
        if (classData.examples.length > 0) {
          await prisma.docExample.createMany({
            data: classData.examples.map((e, k) => ({
              classId: existingClass.id,
              title: e.title,
              code: e.code,
              filename: e.filename,
              showLines: e.showLines,
              sortOrder: k,
            })),
          });
        }
      } else {
        // Create new class with methods and examples
        await prisma.docClass.create({
          data: {
            name: classData.name,
            slug: classData.slug,
            description: classData.description,
            constraints: classData.constraints,
            sortOrder: j,
            moduleId: module.id,
            methods: {
              create: classData.methods.map((m, k) => ({
                name: m.name,
                category: m.category,
                params: m.params,
                returns: m.returns,
                description: m.description,
                sortOrder: k,
              })),
            },
            examples: {
              create: classData.examples.map((e, k) => ({
                title: e.title,
                code: e.code,
                filename: e.filename,
                showLines: e.showLines,
                sortOrder: k,
              })),
            },
          },
        });
      }
    }
  }

  console.log("\nMigration complete!");

  // Print summary
  const totalModules = await prisma.docModule.count();
  const totalClasses = await prisma.docClass.count();
  const totalMethods = await prisma.docMethod.count();
  const totalExamples = await prisma.docExample.count();

  console.log(`\nSummary:`);
  console.log(`  Modules: ${totalModules}`);
  console.log(`  Classes: ${totalClasses}`);
  console.log(`  Methods: ${totalMethods}`);
  console.log(`  Examples: ${totalExamples}`);
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
