import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "FFI",
  description: "Foreign Function Interface in XXML",
};

export default function FFIPage() {
  return (
    <>
      <h1>Foreign Function Interface</h1>
      <p className="lead">
        XXML provides a Foreign Function Interface (FFI) for calling native
        functions from dynamic libraries (DLLs), enabling interoperability with
        system APIs and C libraries.
      </p>

      <h2>Declaring Native Functions</h2>
      <CodeBlock language="xxml">{`@NativeFunction(path = "library.dll", name = "FunctionName", convention = "stdcall")
Method <XXMLMethodName> Returns ReturnType^ Parameters(
    Parameter <param1> Types ParamType1^,
    Parameter <param2> Types ParamType2^
);`}</CodeBlock>

      <h3>Annotation Parameters</h3>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Parameter
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>path</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Path to the DLL (e.g., <code>&quot;kernel32.dll&quot;</code>)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>name</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                The exported symbol name (e.g., <code>&quot;MessageBoxA&quot;</code>)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>convention</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Calling convention: <code>&quot;stdcall&quot;</code>,{" "}
                <code>&quot;cdecl&quot;</code>, or <code>&quot;fastcall&quot;</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Native Types</h2>
      <CodeBlock language="xxml">{`// Native type mapping
NativeType<"int32">   // 32-bit signed integer
NativeType<"int64">   // 64-bit signed integer
NativeType<"uint32">  // 32-bit unsigned integer
NativeType<"ptr">     // Pointer (void*)
NativeType<"float">   // 32-bit float
NativeType<"double">  // 64-bit double`}</CodeBlock>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                XXML Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                C Equivalent
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
                int8_t / char
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
                int32_t / int
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
                int64_t / long long
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                8 bytes
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>NativeType&lt;&quot;ptr&quot;&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                void*
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                8 bytes (64-bit)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Examples</h2>

      <h3>Windows Beep</h3>
      <CodeBlock language="xxml">{`@NativeFunction(path = "kernel32.dll", name = "Beep", convention = "stdcall")
Method <Beep> Returns NativeType<"int32">^ Parameters(
    Parameter <dwFreq> Types NativeType<"uint32">^,
    Parameter <dwDuration> Types NativeType<"uint32">^
);

[ Entrypoint
{
    Run Beep(440, 500);  // A4 note for 500ms
}
]`}</CodeBlock>

      <h3>Windows MessageBox</h3>
      <CodeBlock language="xxml">{`@NativeFunction(path = "user32.dll", name = "MessageBoxA", convention = "stdcall")
Method <MessageBoxA> Returns NativeType<"int32">^ Parameters(
    Parameter <hWnd> Types NativeType<"ptr">^,
    Parameter <lpText> Types NativeType<"ptr">^,
    Parameter <lpCaption> Types NativeType<"ptr">^,
    Parameter <uType> Types NativeType<"uint32">^
);

[ Entrypoint
{
    // String literals auto-marshalled to C strings
    Run MessageBoxA(0, "Hello from XXML!", "XXML FFI", 0);
}
]`}</CodeBlock>

      <Callout type="info">
        XXML automatically marshals string literals to C-style null-terminated
        strings when passed to native functions expecting{" "}
        <code>NativeType&lt;&quot;ptr&quot;&gt;</code> parameters.
      </Callout>

      <h3>C Runtime Functions</h3>
      <CodeBlock language="xxml">{`@NativeFunction(path = "ucrtbase.dll", name = "puts", convention = "cdecl")
Method <puts> Returns NativeType<"int32">^ Parameters(
    Parameter <str> Types NativeType<"ptr">^
);

[ Entrypoint
{
    Run puts("Hello via puts!");
}
]`}</CodeBlock>

      <h2>Opaque Handle Types</h2>
      <p>
        Define type-safe handles using empty <code>NativeStructure</code>{" "}
        declarations:
      </p>
      <CodeBlock language="xxml">{`// Opaque handle types - like C's typedef struct GLFWwindow GLFWwindow;
[ NativeStructure <GLFWwindow> Aligns(8)
[ Public<>
]
]

[ NativeStructure <GLFWmonitor> Aligns(8)
[ Public<>
]
]

// Type-safe function signatures
@NativeFunction(name = "glfwCreateWindow", path = "glfw3.dll", convention = "cdecl")
Method <glfwCreateWindow> Returns GLFWwindow^ Parameters (
    Parameter <width> Types NativeType<"int32">^,
    Parameter <height> Types NativeType<"int32">^,
    Parameter <title> Types NativeType<"ptr">^,
    Parameter <monitor> Types GLFWmonitor^,  // Type-safe!
    Parameter <share> Types GLFWwindow^
);`}</CodeBlock>

      <h2>Calling Conventions</h2>
      <ul>
        <li>
          <strong>stdcall:</strong> Standard Windows API convention. Callee
          cleans stack.
        </li>
        <li>
          <strong>cdecl:</strong> C convention. Caller cleans stack. Used by C
          runtime.
        </li>
        <li>
          <strong>fastcall:</strong> First two arguments in registers. Less
          common.
        </li>
      </ul>

      <h2>Best Practices</h2>
      <ul>
        <li>
          <strong>Match calling conventions:</strong> Windows APIs use{" "}
          <code>stdcall</code>, C runtime uses <code>cdecl</code>
        </li>
        <li>
          <strong>Match types exactly:</strong> Ensure NativeTypes match the C
          signature
        </li>
        <li>
          <strong>Check return values:</strong> Handle potential failures
        </li>
        <li>
          <strong>String encoding:</strong> Use <code>*A</code> variants for
          ANSI, <code>*W</code> for Unicode
        </li>
      </ul>

      <h2>Limitations</h2>
      <ul>
        <li>Varargs functions have limited support</li>
        <li>Callback functions (function pointers) not yet supported</li>
        <li>Wide string (Unicode) marshalling requires manual conversion</li>
        <li>Struct return values not yet supported</li>
      </ul>

      <h2>Next Steps</h2>
      <p>
        Learn about{" "}
        <a href="/docs/advanced/native-types">Native Types</a> for low-level
        memory operations, or explore{" "}
        <a href="/docs/advanced/destructors">Destructors</a> for RAII-style
        resource cleanup with native resources.
      </p>
    </>
  );
}
