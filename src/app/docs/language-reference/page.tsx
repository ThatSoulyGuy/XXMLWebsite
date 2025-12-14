import Link from "next/link";

export const metadata = {
  title: "Language Reference",
  description: "Complete reference for the XXML programming language",
};

const sections = [
  {
    title: "Syntax",
    href: "/docs/language-reference/syntax",
    description: "Basic syntax rules, keywords, and program structure",
  },
  {
    title: "Types",
    href: "/docs/language-reference/types",
    description: "Primitive types, strings, arrays, and custom types",
  },
  {
    title: "Ownership",
    href: "/docs/language-reference/ownership",
    description: "Memory management with owned, reference, and copy modifiers",
  },
  {
    title: "Generics",
    href: "/docs/language-reference/generics",
    description: "Generic templates with type constraints",
  },
  {
    title: "Classes",
    href: "/docs/language-reference/classes",
    description: "Object-oriented programming with classes and inheritance",
  },
  {
    title: "Lambdas",
    href: "/docs/language-reference/lambdas",
    description: "Anonymous functions and closures",
  },
];

export default function LanguageReferencePage() {
  return (
    <>
      <h1>Language Reference</h1>
      <p className="lead">
        A comprehensive guide to the XXML programming language syntax and features.
      </p>

      <div className="not-prose mt-8 grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-lg border border-zinc-200 p-4 transition-colors hover:border-blue-500 hover:bg-blue-50/50 dark:border-zinc-800 dark:hover:bg-blue-900/20"
          >
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              {section.title}
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
              {section.description}
            </p>
          </Link>
        ))}
      </div>

      <h2>Overview</h2>
      <p>
        XXML is a statically-typed, compiled language that combines the performance
        of systems programming with modern language features. Key characteristics include:
      </p>

      <ul>
        <li>
          <strong>Explicit ownership</strong> - Memory management through <code>^owned</code>,{" "}
          <code>&amp;reference</code>, and <code>%copy</code> modifiers
        </li>
        <li>
          <strong>Generic templates</strong> - Type-safe generics with constraint support
        </li>
        <li>
          <strong>Object-oriented</strong> - Classes, inheritance, and access modifiers
        </li>
        <li>
          <strong>Functional features</strong> - Lambda expressions with capture semantics
        </li>
        <li>
          <strong>LLVM backend</strong> - Compiles to native code via LLVM IR
        </li>
      </ul>
    </>
  );
}
