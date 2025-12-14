import Link from "next/link";
import { ArrowRight, BookOpen, Code, Zap } from "lucide-react";

export const metadata = {
  title: "Documentation",
  description: "Learn how to use XXML - a modern compiled programming language",
};

export default function DocsPage() {
  return (
    <div className="not-prose">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        XXML Documentation
      </h1>
      <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-300">
        Welcome to the XXML documentation. Learn how to write efficient, safe code with
        explicit ownership semantics and powerful generics.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/docs/getting-started/installation"
          className="group rounded-lg border border-zinc-200 p-6 transition-all hover:border-blue-500 hover:shadow-md dark:border-zinc-800"
        >
          <Zap className="h-8 w-8 text-blue-600" />
          <h3 className="mt-4 font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100">
            Quick Start
          </h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-300">
            Get up and running with XXML in minutes. Install the compiler and write your first program.
          </p>
        </Link>

        <Link
          href="/docs/language-reference"
          className="group rounded-lg border border-zinc-200 p-6 transition-all hover:border-blue-500 hover:shadow-md dark:border-zinc-800"
        >
          <BookOpen className="h-8 w-8 text-purple-600" />
          <h3 className="mt-4 font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100">
            Language Reference
          </h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-300">
            Deep dive into XXML syntax, types, ownership, generics, and more.
          </p>
        </Link>

        <Link
          href="/docs/standard-library"
          className="group rounded-lg border border-zinc-200 p-6 transition-all hover:border-blue-500 hover:shadow-md dark:border-zinc-800"
        >
          <Code className="h-8 w-8 text-green-600" />
          <h3 className="mt-4 font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100">
            Standard Library
          </h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-300">
            Explore the built-in modules for collections, I/O, networking, and more.
          </p>
        </Link>
      </div>

      <div className="mt-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
        <h2 className="text-2xl font-bold">Hello World in XXML</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-black/20 p-4 text-sm">
          <code>{`#import Language::Core;

[ Entrypoint
{
    Instantiate String^ As <message> = String::Constructor("Hello, World!");
    Run Console::printLine(message);
    Exit(0);
}
]`}</code>
        </pre>
        <Link
          href="/docs/getting-started/hello-world"
          className="mt-6 inline-flex items-center rounded-lg bg-white px-4 py-2 font-medium text-blue-600 hover:bg-zinc-100"
        >
          Learn More <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Key Features</h2>
        <ul className="mt-4 space-y-3 text-zinc-500 dark:text-zinc-300">
          <li className="flex items-start gap-3">
            <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              ^owned
            </span>
            <span>Explicit ownership semantics for memory safety without garbage collection</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-600 dark:bg-purple-900 dark:text-purple-400">
              &amp;ref
            </span>
            <span>Borrowed references for safe, non-owning access to data</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-900 dark:text-green-400">
              %copy
            </span>
            <span>Value copies for independent data manipulation</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-600 dark:bg-orange-900 dark:text-orange-400">
              LLVM
            </span>
            <span>Native compilation via LLVM for high performance</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
