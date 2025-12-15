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
          className="group rounded-xl border border-white/30 bg-white/60 p-6 shadow-lg backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] dark:border-white/10 dark:bg-zinc-900/60"
        >
          <Zap className="h-8 w-8 text-blue-600" />
          <h3 className="mt-4 font-semibold text-zinc-900 group-hover:text-cyan-600 dark:text-zinc-100">
            Quick Start
          </h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-300">
            Get up and running with XXML in minutes. Install the compiler and write your first program.
          </p>
        </Link>

        <Link
          href="/docs/language-reference"
          className="group rounded-xl border border-white/30 bg-white/60 p-6 shadow-lg backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] dark:border-white/10 dark:bg-zinc-900/60"
        >
          <BookOpen className="h-8 w-8 text-purple-600" />
          <h3 className="mt-4 font-semibold text-zinc-900 group-hover:text-cyan-600 dark:text-zinc-100">
            Language Reference
          </h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-300">
            Deep dive into XXML syntax, types, ownership, generics, and more.
          </p>
        </Link>

        <Link
          href="/docs/standard-library"
          className="group rounded-xl border border-white/30 bg-white/60 p-6 shadow-lg backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] dark:border-white/10 dark:bg-zinc-900/60"
        >
          <Code className="h-8 w-8 text-green-600" />
          <h3 className="mt-4 font-semibold text-zinc-900 group-hover:text-cyan-600 dark:text-zinc-100">
            Standard Library
          </h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-300">
            Explore the built-in modules for collections, I/O, networking, and more.
          </p>
        </Link>
      </div>

      <div className="mt-12 overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-blue-600/90 to-purple-600/90 p-8 text-white shadow-xl backdrop-blur-xl">
        <h2 className="text-2xl font-bold">Hello World in XXML</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-white/10 bg-black/30 p-4 text-sm backdrop-blur-sm">
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
          className="mt-6 inline-flex items-center rounded-lg border border-white/20 bg-white/90 px-4 py-2 font-medium text-blue-600 backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg"
        >
          Learn More <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      <div className="mt-12 rounded-xl border border-white/20 bg-white/50 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Key Features</h2>
        <ul className="mt-4 space-y-3 text-zinc-600 dark:text-zinc-300">
          <li className="flex items-start gap-3">
            <span className="rounded-lg border border-blue-200/50 bg-blue-100/80 px-2 py-1 text-xs font-medium text-blue-600 backdrop-blur-sm dark:border-blue-500/30 dark:bg-blue-900/50 dark:text-blue-400">
              ^owned
            </span>
            <span>Explicit ownership semantics for memory safety without garbage collection</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="rounded-lg border border-purple-200/50 bg-purple-100/80 px-2 py-1 text-xs font-medium text-purple-600 backdrop-blur-sm dark:border-purple-500/30 dark:bg-purple-900/50 dark:text-purple-400">
              &amp;ref
            </span>
            <span>Borrowed references for safe, non-owning access to data</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="rounded-lg border border-green-200/50 bg-green-100/80 px-2 py-1 text-xs font-medium text-green-600 backdrop-blur-sm dark:border-green-500/30 dark:bg-green-900/50 dark:text-green-400">
              %copy
            </span>
            <span>Value copies for independent data manipulation</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="rounded-lg border border-orange-200/50 bg-orange-100/80 px-2 py-1 text-xs font-medium text-orange-600 backdrop-blur-sm dark:border-orange-500/30 dark:bg-orange-900/50 dark:text-orange-400">
              LLVM
            </span>
            <span>Native compilation via LLVM for high performance</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
