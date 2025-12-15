import Link from "next/link";
import { getModules } from "@/actions/docs";
import { CodeBlock } from "@/components/docs/code-block";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/types";
import { Settings } from "lucide-react";

const DOC_EDITOR_ROLES: UserRole[] = ["DEVELOPER", "ADMIN"];

export const metadata = {
  title: "Standard Library",
  description: "XXML standard library reference",
};

export default async function StandardLibraryPage() {
  const modules = await getModules();

  // Check if user can edit docs
  const session = await auth();
  let canEdit = false;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    canEdit = user ? DOC_EDITOR_ROLES.includes(user.role as UserRole) : false;
  }

  return (
    <>
      <div className="not-prose mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Standard Library
        </h1>
        {canEdit && (
          <Link
            href="/docs/standard-library/editor"
            className="flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/60 px-3 py-1.5 text-sm font-medium text-zinc-600 backdrop-blur-sm transition-colors hover:border-cyan-500/40 hover:text-cyan-600 dark:border-white/10 dark:bg-zinc-800/60 dark:text-zinc-400 dark:hover:border-cyan-500/40 dark:hover:text-cyan-400"
          >
            <Settings className="h-4 w-4" />
            Manage Documentation
          </Link>
        )}
      </div>
      <p className="lead">
        The XXML Standard Library provides fundamental types, collections, and
        utilities for building applications.
      </p>

      <h2>Module Structure</h2>
      <CodeBlock language="text">{`Language/
├── Core/           # Primitive types (Integer, String, Bool, Float, Double)
├── Collections/    # Generic data structures (List, HashMap, Set, Stack, Queue)
├── System/         # Console I/O
├── IO/             # File operations
├── Math/           # Mathematical functions
├── Text/           # String utilities, Regex
├── Time/           # Date/time handling
├── Format/         # JSON parsing
├── Network/        # HTTP client
├── Reflection/     # Runtime type introspection
├── Concurrent/     # Threading and synchronization
├── Test/           # Unit testing framework
└── Annotations/    # Built-in annotations (@Unsafe, etc.)`}</CodeBlock>

      <h2>Importing Modules</h2>
      <CodeBlock language="xxml">{`#import Language::Core;           // Integer, String, Bool, Float, Double
#import Language::Collections;    // List, HashMap, Set, Array, Stack, Queue
#import Language::System;         // Console
#import Language::IO;             // File
#import Language::Math;           // Math utilities
#import Language::Text;           // StringUtils, Pattern
#import Language::Time;           // DateTime, Timer
#import Language::Format;         // JSONObject, JSONArray
#import Language::Network;        // HTTPClient
#import Language::Reflection;     // Type introspection
#import Language::Concurrent;     // Threading
#import Language::Test;           // TestRunner, Assert`}</CodeBlock>

      <h2>Module Reference</h2>
      <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/docs/standard-library/core"
          className="group rounded-xl border border-white/30 bg-white/60 p-4 shadow-md backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] dark:border-white/10 dark:bg-zinc-900/60"
        >
          <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-cyan-600 dark:text-zinc-100">
            Core Types
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Integer, String, Bool, Float, Double - primitive wrapper types
          </p>
        </Link>
        <Link
          href="/docs/standard-library/collections"
          className="group rounded-xl border border-white/30 bg-white/60 p-4 shadow-md backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] dark:border-white/10 dark:bg-zinc-900/60"
        >
          <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-cyan-600 dark:text-zinc-100">
            Collections
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            List, HashMap, Set, Array, Stack, Queue - generic data structures
          </p>
        </Link>
        <Link
          href="/docs/standard-library/iterators"
          className="group rounded-xl border border-white/30 bg-white/60 p-4 shadow-md backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] dark:border-white/10 dark:bg-zinc-900/60"
        >
          <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-cyan-600 dark:text-zinc-100">
            Iterators
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            ListIterator, SetIterator, HashMapIterator - collection traversal
          </p>
        </Link>
        <Link
          href="/docs/standard-library/console"
          className="group rounded-xl border border-white/30 bg-white/60 p-4 shadow-md backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] dark:border-white/10 dark:bg-zinc-900/60"
        >
          <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-cyan-600 dark:text-zinc-100">
            Console
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Console I/O, environment variables, system utilities
          </p>
        </Link>
        <Link
          href="/docs/standard-library/file-io"
          className="group rounded-xl border border-white/30 bg-white/60 p-4 shadow-md backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] dark:border-white/10 dark:bg-zinc-900/60"
        >
          <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-cyan-600 dark:text-zinc-100">
            File I/O
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            File reading, writing, and management operations
          </p>
        </Link>
        <Link
          href="/docs/standard-library/text"
          className="group rounded-xl border border-white/30 bg-white/60 p-4 shadow-md backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] dark:border-white/10 dark:bg-zinc-900/60"
        >
          <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-cyan-600 dark:text-zinc-100">
            Text
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            StringUtils, Pattern - string manipulation and regex
          </p>
        </Link>
        <Link
          href="/docs/standard-library/math"
          className="group rounded-xl border border-white/30 bg-white/60 p-4 shadow-md backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] dark:border-white/10 dark:bg-zinc-900/60"
        >
          <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-cyan-600 dark:text-zinc-100">
            Math
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Mathematical functions, random numbers, number theory
          </p>
        </Link>
        <Link
          href="/docs/standard-library/time"
          className="group rounded-xl border border-white/30 bg-white/60 p-4 shadow-md backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] dark:border-white/10 dark:bg-zinc-900/60"
        >
          <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-cyan-600 dark:text-zinc-100">
            Time
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            DateTime, TimeSpan, Timer - date/time handling
          </p>
        </Link>
        <Link
          href="/docs/standard-library/json"
          className="group rounded-xl border border-white/30 bg-white/60 p-4 shadow-md backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] dark:border-white/10 dark:bg-zinc-900/60"
        >
          <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-cyan-600 dark:text-zinc-100">
            JSON
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            JSONObject, JSONArray - JSON parsing and generation
          </p>
        </Link>
        <Link
          href="/docs/standard-library/http"
          className="group rounded-xl border border-white/30 bg-white/60 p-4 shadow-md backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] dark:border-white/10 dark:bg-zinc-900/60"
        >
          <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-cyan-600 dark:text-zinc-100">
            HTTP
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            HTTPClient, HTTPResponse - web requests
          </p>
        </Link>
        <Link
          href="/docs/standard-library/testing"
          className="group rounded-xl border border-white/30 bg-white/60 p-4 shadow-md backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] dark:border-white/10 dark:bg-zinc-900/60"
        >
          <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-cyan-600 dark:text-zinc-100">
            Testing
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            TestRunner, Assert - unit testing framework
          </p>
        </Link>
        <Link
          href="/docs/advanced/threading"
          className="group rounded-xl border border-white/30 bg-white/60 p-4 shadow-md backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] dark:border-white/10 dark:bg-zinc-900/60"
        >
          <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-cyan-600 dark:text-zinc-100">
            Concurrent
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Thread, Mutex, Atomic - threading and synchronization
          </p>
        </Link>
      </div>

      {modules.length > 0 && (
        <>
          <h2>API Reference</h2>
          <div className="not-prose mt-6 grid gap-4 sm:grid-cols-2">
            {modules.map((module) => (
              <div
                key={module.id}
                className="rounded-xl border border-white/30 bg-white/60 p-4 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {module.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {module.description}
                </p>
                {module.classes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {module.classes.map((cls) => (
                      <Link
                        key={cls.id}
                        href={`/docs/standard-library/${module.slug}/${cls.slug}`}
                        className="rounded-md border border-white/20 bg-white/50 px-2 py-0.5 text-xs font-medium text-zinc-700 backdrop-blur-sm transition-colors hover:border-cyan-500/30 hover:text-cyan-700 dark:border-white/10 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:border-cyan-500/30 dark:hover:text-cyan-400"
                      >
                        {cls.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <h2>Constraints</h2>
      <p>
        The standard library defines these constraints for generic types:
      </p>
      <div className="not-prose my-6 overflow-hidden rounded-xl border border-white/30 shadow-lg backdrop-blur-xl dark:border-white/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20 bg-white/40 dark:border-white/10 dark:bg-zinc-800/60">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Constraint
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Required Methods
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20 bg-white/60 dark:divide-white/10 dark:bg-zinc-900/60">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Hashable&lt;T&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <code>hash(): NativeType&lt;&quot;int64&quot;&gt;^</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Equatable&lt;T&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <code>equals(other: T&amp;): Bool^</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Sendable&lt;T&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                (marker) - Type can be moved across threads
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Sharable&lt;T&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                (marker) - Type can be shared across threads
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Quick Reference</h2>

      <h3>Creating Values</h3>
      <CodeBlock language="xxml">{`// Integers
Instantiate Integer^ As <n> = Integer::Constructor(42);

// Strings
Instantiate String^ As <s> = String::Constructor("Hello");

// Booleans
Instantiate Bool^ As <flag> = Bool::Constructor(true);

// Floating point
Instantiate Double^ As <d> = Double::Constructor(3.14159265359D);

// Lists
Instantiate Collections::List<Integer>^ As <numbers> =
    Collections::List@Integer::Constructor();

// Maps
Instantiate Collections::HashMap<String, Integer>^ As <ages> =
    Collections::HashMap@String, Integer::Constructor();`}</CodeBlock>

      <h3>Common Operations</h3>
      <CodeBlock language="xxml">{`// Console output
Run Console::printLine(message);

// String operations
Instantiate String^ As <combined> = str1.append(str2);
Instantiate Integer^ As <len> = str.length();

// Integer arithmetic
Instantiate Integer^ As <sum> = a.add(b);
Instantiate Integer^ As <product> = a.multiply(b);
Instantiate String^ As <text> = n.toString();

// List operations
Run list.add(value);
Instantiate T^ As <item> = list.get(index);
Instantiate Integer^ As <size> = list.size();`}</CodeBlock>
    </>
  );
}
