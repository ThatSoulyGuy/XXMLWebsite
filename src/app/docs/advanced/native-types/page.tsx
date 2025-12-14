import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Native Types",
  description: "Low-level types and memory operations in XXML",
};

export default function NativeTypesPage() {
  return (
    <>
      <h1>Native Types</h1>
      <p className="lead">
        XXML provides access to low-level types and memory operations for
        systems programming, enabling direct hardware-level access when needed.
      </p>

      <h2>NativeType</h2>
      <CodeBlock language="xxml">{`// Property declarations
Property <ptr> Types NativeType<"void*">^;
Property <count> Types NativeType<"int64">^;
Property <flags> Types NativeType<"uint32">^;
Property <byte> Types NativeType<"uint8">^;

// Local variables
Instantiate NativeType<"int64">% As <size> = 1024;
Instantiate NativeType<"void*">% As <buffer> = Syscall::malloc(size);`}</CodeBlock>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Description
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Size
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>NativeType&lt;&quot;int8&quot;&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Signed 8-bit integer
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                1 byte
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>NativeType&lt;&quot;uint8&quot;&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Unsigned 8-bit (byte)
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                1 byte
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>NativeType&lt;&quot;int32&quot;&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Signed 32-bit integer
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                4 bytes
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>NativeType&lt;&quot;int64&quot;&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Signed 64-bit integer
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                8 bytes
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>NativeType&lt;&quot;void*&quot;&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Pointer
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                8 bytes (64-bit)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>NativeType&lt;&quot;float&quot;&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                32-bit floating point
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                4 bytes
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>NativeType&lt;&quot;double&quot;&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                64-bit floating point
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                8 bytes
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>NativeStructure</h2>
      <p>Define C-compatible structures for FFI:</p>
      <CodeBlock language="xxml">{`[ NativeStructure <Point>
    [ Public <>
        Property <x> Types NativeType<"int32">%;
        Property <y> Types NativeType<"int32">%;
    ]
]

[ NativeStructure <Rectangle>
    [ Public <>
        Property <left> Types NativeType<"int32">%;
        Property <top> Types NativeType<"int32">%;
        Property <right> Types NativeType<"int32">%;
        Property <bottom> Types NativeType<"int32">%;
    ]
]

// Usage
Instantiate Point% As <p>;
Set p.x = 10;
Set p.y = 20;
Run nativeDrawPoint(&p);`}</CodeBlock>

      <h2>Syscall Interface</h2>

      <h3>Memory Management</h3>
      <CodeBlock language="xxml">{`// Allocate memory
Instantiate NativeType<"void*">% As <ptr> = Syscall::malloc(size);

// Free memory
Run Syscall::free(ptr);

// Copy memory
Run Syscall::memcpy(dest, src, numBytes);

// Set memory
Run Syscall::memset(ptr, value, numBytes);`}</CodeBlock>

      <h3>Pointer Operations</h3>
      <CodeBlock language="xxml">{`// Read value from pointer
Instantiate MyType^ As <value> = Syscall::ptr_read(pointer);

// Write value to pointer
Run Syscall::ptr_write(pointer, value);

// Read single byte
Instantiate NativeType<"uint8">% As <byte> = Syscall::read_byte(pointer);

// Write single byte
Run Syscall::write_byte(pointer, byteValue);`}</CodeBlock>

      <h2>Pointer Arithmetic</h2>
      <CodeBlock language="xxml">{`// Calculate offset
Instantiate NativeType<"void*">% As <base> = Syscall::malloc(100);
Instantiate NativeType<"int64">% As <offset> = 10;
Instantiate NativeType<"void*">% As <ptr> = base + offset;

// Pointer subtraction
Instantiate NativeType<"int64">% As <diff> = ptr2 - ptr1;`}</CodeBlock>

      <h2>Complete Example: Buffer Class</h2>
      <CodeBlock language="xxml" filename="buffer.xxml">{`[ Class <Buffer> Final Extends None
    [ Private <>
        Property <data> Types NativeType<"void*">^;
        Property <size> Types NativeType<"int64">^;
    ]

    [ Public <>
        Constructor Parameters (
            Parameter <bufferSize> Types NativeType<"int64">%
        ) -> {
            Set data = Syscall::malloc(bufferSize);
            Set size = bufferSize;
            Run Syscall::memset(data, 0, bufferSize);
        }

        Destructor Parameters () -> {
            Run Syscall::free(data);
        }

        Method <write> Returns None Parameters (
            Parameter <offset> Types NativeType<"int64">%,
            Parameter <value> Types NativeType<"uint8">%
        ) Do {
            Instantiate NativeType<"void*">% As <ptr> = data + offset;
            Run Syscall::write_byte(ptr, value);
        }

        Method <read> Returns NativeType<"uint8">% Parameters (
            Parameter <offset> Types NativeType<"int64">%
        ) Do {
            Instantiate NativeType<"void*">% As <ptr> = data + offset;
            Return Syscall::read_byte(ptr);
        }

        Method <getSize> Returns NativeType<"int64">% Parameters () Do {
            Return size;
        }
    ]
]`}</CodeBlock>

      <Callout type="warning">
        Native memory operations bypass XXML&apos;s safety guarantees. Always
        pair <code>malloc</code> with <code>free</code>, check for null
        pointers, and validate buffer bounds.
      </Callout>

      <h2>Best Practices</h2>

      <h3>Memory Safety</h3>
      <ul>
        <li>
          <strong>Always free allocated memory</strong> - Match every{" "}
          <code>malloc</code> with <code>free</code>
        </li>
        <li>
          <strong>Check for null</strong> - Verify allocation succeeded before
          use
        </li>
        <li>
          <strong>Avoid buffer overflows</strong> - Validate indices before
          access
        </li>
        <li>
          <strong>Use RAII</strong> - Wrap native resources in classes with
          destructors
        </li>
      </ul>

      <h3>Performance</h3>
      <ul>
        <li>Minimize allocations - Reuse buffers when possible</li>
        <li>Align data - Use natural alignment for better cache performance</li>
        <li>
          Batch operations - Use <code>memcpy</code> for bulk transfers
        </li>
      </ul>

      <h2>Next Steps</h2>
      <p>
        Learn about <a href="/docs/advanced/ffi">FFI</a> for calling native
        libraries, or explore{" "}
        <a href="/docs/advanced/destructors">Destructors</a> for RAII-style
        cleanup.
      </p>
    </>
  );
}
