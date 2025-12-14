import Link from "next/link";

export const metadata = {
  title: "Advanced Topics",
  description: "Advanced features for experienced XXML developers",
};

export default function AdvancedPage() {
  return (
    <>
      <h1>Advanced Topics</h1>
      <p className="lead">
        Explore advanced XXML features including memory management, reflection,
        annotations, and interoperability with native code.
      </p>

      <h2>Topics</h2>

      <div className="not-prose grid gap-4 md:grid-cols-2">
        <Link
          href="/docs/advanced/destructors"
          className="group block rounded-lg border border-zinc-200 p-4 hover:border-blue-500 hover:bg-blue-50/50 dark:border-zinc-700 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
        >
          <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
            Destructors
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            RAII-style resource cleanup with automatic destructor calls
          </p>
        </Link>

        <Link
          href="/docs/advanced/reflection"
          className="group block rounded-lg border border-zinc-200 p-4 hover:border-blue-500 hover:bg-blue-50/50 dark:border-zinc-700 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
        >
          <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
            Reflection
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Runtime type introspection and metadata access
          </p>
        </Link>

        <Link
          href="/docs/advanced/annotations"
          className="group block rounded-lg border border-zinc-200 p-4 hover:border-blue-500 hover:bg-blue-50/50 dark:border-zinc-700 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
        >
          <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
            Annotations
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Java-style annotation system for metadata and compile-time
            processing
          </p>
        </Link>

        <Link
          href="/docs/advanced/derives"
          className="group block rounded-lg border border-zinc-200 p-4 hover:border-blue-500 hover:bg-blue-50/50 dark:border-zinc-700 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
        >
          <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
            Derives
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Automatic method generation for common patterns
          </p>
        </Link>

        <Link
          href="/docs/advanced/ffi"
          className="group block rounded-lg border border-zinc-200 p-4 hover:border-blue-500 hover:bg-blue-50/50 dark:border-zinc-700 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
        >
          <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
            FFI
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Foreign function interface for calling native libraries
          </p>
        </Link>

        <Link
          href="/docs/advanced/native-types"
          className="group block rounded-lg border border-zinc-200 p-4 hover:border-blue-500 hover:bg-blue-50/50 dark:border-zinc-700 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
        >
          <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
            Native Types
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Low-level types and memory operations for systems programming
          </p>
        </Link>

        <Link
          href="/docs/advanced/threading"
          className="group block rounded-lg border border-zinc-200 p-4 hover:border-blue-500 hover:bg-blue-50/50 dark:border-zinc-700 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
        >
          <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
            Threading
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Multithreading with mutexes, atomics, and thread-safety constraints
          </p>
        </Link>
      </div>
    </>
  );
}
