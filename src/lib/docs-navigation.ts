export interface NavItem {
  title: string;
  href: string;
  badge?: string;
  items?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const docsNavigation: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/getting-started/installation" },
      { title: "Hello World", href: "/docs/getting-started/hello-world" },
    ],
  },
  {
    title: "Language Reference",
    items: [
      { title: "Overview", href: "/docs/language-reference" },
      { title: "Syntax", href: "/docs/language-reference/syntax" },
      { title: "Types", href: "/docs/language-reference/types" },
      { title: "Ownership", href: "/docs/language-reference/ownership", badge: "Core" },
      { title: "Classes", href: "/docs/language-reference/classes" },
      { title: "Structures", href: "/docs/language-reference/structures" },
      { title: "Enumerations", href: "/docs/language-reference/enumerations" },
      { title: "Generics", href: "/docs/language-reference/generics" },
      { title: "Constraints", href: "/docs/language-reference/constraints" },
      { title: "Lambdas", href: "/docs/language-reference/lambdas" },
      { title: "Compile-Time", href: "/docs/language-reference/compiletime" },
    ],
  },
  {
    title: "Advanced Topics",
    items: [
      { title: "Overview", href: "/docs/advanced" },
      { title: "Destructors", href: "/docs/advanced/destructors" },
      { title: "Reflection", href: "/docs/advanced/reflection" },
      { title: "Annotations", href: "/docs/advanced/annotations" },
      { title: "Derives", href: "/docs/advanced/derives" },
      { title: "FFI", href: "/docs/advanced/ffi" },
      { title: "Native Types", href: "/docs/advanced/native-types" },
      { title: "Threading", href: "/docs/advanced/threading" },
    ],
  },
  {
    title: "Tools",
    items: [
      { title: "CLI Reference", href: "/docs/tools/cli" },
      { title: "Import System", href: "/docs/tools/imports" },
      { title: "VS Code Extension", href: "/docs/tools/vscode" },
      { title: "Architecture", href: "/docs/tools/architecture" },
    ],
  },
  {
    title: "Standard Library",
    items: [
      { title: "Overview", href: "/docs/standard-library" },
      { title: "Core Types", href: "/docs/standard-library/core" },
      { title: "Collections", href: "/docs/standard-library/collections" },
      { title: "Iterators", href: "/docs/standard-library/iterators" },
      { title: "Console", href: "/docs/standard-library/console" },
      { title: "File I/O", href: "/docs/standard-library/file-io" },
      { title: "Text", href: "/docs/standard-library/text" },
      { title: "Math", href: "/docs/standard-library/math" },
      { title: "Time", href: "/docs/standard-library/time" },
      { title: "JSON", href: "/docs/standard-library/json" },
      { title: "HTTP", href: "/docs/standard-library/http" },
      { title: "Testing", href: "/docs/standard-library/testing" },
    ],
  },
  {
    title: "Examples",
    items: [
      { title: "Overview", href: "/docs/examples" },
      { title: "Basic Programs", href: "/docs/examples/basic-programs" },
      { title: "Ownership Patterns", href: "/docs/examples/ownership-patterns" },
    ],
  },
];
