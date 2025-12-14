import { CodeBlock } from "@/components/docs/code-block";
import Link from "next/link";

export const metadata = {
  title: "Tools",
  description: "Development tools for XXML",
};

export default function ToolsPage() {
  return (
    <>
      <h1>XXML Tools</h1>
      <p className="lead">
        XXML provides a suite of development tools including the compiler CLI,
        VS Code extension with language server support, and a modular import
        system.
      </p>

      <h2>Quick Start</h2>
      <CodeBlock language="bash">{`# Compile an XXML program
xxml Hello.XXML -o hello.exe

# Run the executable
./hello.exe`}</CodeBlock>

      <h2>Available Tools</h2>

      <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/docs/tools/cli"
          className="group rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/50"
        >
          <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
            CLI Reference
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Command-line interface for compiling XXML programs to native
            executables or LLVM IR.
          </p>
        </Link>

        <Link
          href="/docs/tools/imports"
          className="group rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/50"
        >
          <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
            Import System
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            File-based module system for code organization and reuse with
            automatic discovery.
          </p>
        </Link>

        <Link
          href="/docs/tools/vscode"
          className="group rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/50"
        >
          <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
            VS Code Extension
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Full IDE support with syntax highlighting, diagnostics, code
            navigation, and ownership visualization.
          </p>
        </Link>

        <Link
          href="/docs/tools/architecture"
          className="group rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/50"
        >
          <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
            Compiler Architecture
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Multi-stage compiler internals: lexer, parser, semantic analysis,
            and LLVM code generation.
          </p>
        </Link>
      </div>

      <h2>Compilation Pipeline</h2>
      <CodeBlock language="text">{`Source (.XXML)
    ↓
Lexical Analysis
    ↓
Syntax Analysis (AST)
    ↓
Semantic Analysis
    ↓
LLVM IR Generation (.ll)
    ↓
LLVM Compilation (.obj)
    ↓
Linking (.exe / .dll)`}</CodeBlock>

      <h2>Environment Setup</h2>
      <p>The XXML toolchain requires:</p>
      <ul>
        <li>
          <strong>Standard Library:</strong> <code>Language/</code> directory
          relative to compiler location
        </li>
        <li>
          <strong>LLVM Tools:</strong> <code>llc</code>, <code>lld-link</code>{" "}
          in PATH for executable generation
        </li>
        <li>
          <strong>Visual Studio Build Tools:</strong> For Windows linking
        </li>
      </ul>

      <h2>Project Structure</h2>
      <CodeBlock language="text">{`xxml/
├── xxml.exe              # Compiler executable
└── Language/             # Standard library
    ├── Core/
    │   ├── String.XXML
    │   ├── Integer.XXML
    │   ├── Bool.XXML
    │   └── Console.XXML
    └── Concurrent/
        └── Thread.XXML

MyProject/
├── Main.XXML             # Your code
└── Utils/
    └── Helpers.XXML      # Your modules`}</CodeBlock>

      <h2>Next Steps</h2>
      <p>
        Start with the <Link href="/docs/tools/cli">CLI Reference</Link> to
        learn compilation options, or set up your editor with the{" "}
        <Link href="/docs/tools/vscode">VS Code Extension</Link>.
      </p>
    </>
  );
}
