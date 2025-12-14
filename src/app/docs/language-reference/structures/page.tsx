import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Structures",
  description: "Stack-allocated value types in XXML",
};

export default function StructuresPage() {
  return (
    <>
      <h1>Structures</h1>
      <p className="lead">
        Structures are value types in XXML that are allocated on the stack
        rather than the heap, providing efficient, lightweight data containers
        with automatic RAII cleanup.
      </p>

      <h2>Overview</h2>
      <p>
        Structures provide an alternative to classes when you need
        high-performance, stack-allocated data containers. They&apos;re ideal
        for small, short-lived data aggregates.
      </p>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Feature
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Stack Allocation
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Memory allocated with <code>alloca</code>, not{" "}
                <code>malloc</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Value Semantics
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Properties store values directly (not pointers)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                RAII Cleanup
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Automatic destructor call when leaving scope
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                No Inheritance
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Structures cannot extend other types
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Template Support
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Full template parameter support
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Basic Syntax</h2>
      <CodeBlock language="xxml">{`[ Structure <StructureName>
    [ Public <>
        Property <field1> Types Integer^;
        Property <field2> Types String^;

        Constructor Parameters (Parameter <f1> Types Integer%, Parameter <f2> Types String%) -> {
            Set field1 = f1;
            Set field2 = f2;
        }

        Destructor Parameters () -> {
            // Cleanup code (optional)
        }

        Method <someMethod> Returns Integer^ Parameters () -> {
            Return field1;
        }
    ]
]`}</CodeBlock>

      <h2>Structure vs Class</h2>
      <p>
        Understanding when to use structures versus classes is key to writing
        efficient XXML code.
      </p>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Feature
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Class
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Structure
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Storage
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Heap (malloc)
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Stack (alloca)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Inheritance
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Supported
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Not supported
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Properties
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Store pointers
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Store values directly
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Default Passing
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                By reference
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                By value (copy)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Memory Model Comparison</h3>
      <p>
        <strong>Class (Heap Allocation):</strong>
      </p>
      <CodeBlock language="text">{`Variable: [ptr] ──────> Heap: [vtable_ptr][field1_ptr][field2_ptr]...
                               │            │
                               v            v
                          [vtable]    [field value]`}</CodeBlock>

      <p>
        <strong>Structure (Stack Allocation):</strong>
      </p>
      <CodeBlock language="text">{`Stack Frame: [field1_value][field2_value]...
              └──── embedded directly ────┘`}</CodeBlock>

      <h2>Example: Vec2 Structure</h2>
      <CodeBlock language="xxml" filename="vec2.xxml">{`[ Structure <Vec2>
    [ Public <>
        Property <x> Types Double^;
        Property <y> Types Double^;

        Constructor Parameters (
            Parameter <px> Types Double%,
            Parameter <py> Types Double%
        ) -> {
            Set x = px;
            Set y = py;
        }

        Method <length> Returns Double^ Parameters () -> {
            Return x.multiply(x).add(y.multiply(y)).sqrt();
        }
    ]
]

[ Entrypoint
    {
        // v is allocated on the stack, not the heap
        Instantiate Vec2 As <v> = Vec2::Constructor(
            Double::Constructor(3.0),
            Double::Constructor(4.0)
        );

        // v.length() returns 5.0
        Run Console::printLine(v.length().toString());

        // v is automatically cleaned up when the entrypoint exits
        Exit(0);
    }
]`}</CodeBlock>

      <Callout type="info">
        Structures are allocated on the stack using LLVM&apos;s{" "}
        <code>alloca</code> instruction, providing no heap overhead, automatic
        cleanup when the function returns, and better cache locality.
      </Callout>

      <h2>Template Structures</h2>
      <p>Structures support template parameters just like classes:</p>
      <CodeBlock language="xxml">{`[ Structure <Pair> <T Constrains None, U Constrains None>
    [ Public <>
        Property <first> Types T^;
        Property <second> Types U^;

        Constructor Parameters (Parameter <f> Types T%, Parameter <s> Types U%) -> {
            Set first = f;
            Set second = s;
        }
    ]
]

// Usage
Instantiate Pair<Integer, String> As <p> = Pair<Integer, String>::Constructor(
    Integer::Constructor(42),
    String::Constructor("hello")
);`}</CodeBlock>

      <h2>When to Use Structures</h2>

      <h3>Good Use Cases</h3>
      <ul>
        <li>Small, short-lived data aggregates</li>
        <li>Performance-critical code (avoid heap allocation overhead)</li>
        <li>Simple data containers without inheritance needs</li>
        <li>Interop with C/C++ value types</li>
      </ul>

      <CodeBlock language="xxml">{`// Good: Small coordinate pair
[ Structure <Point>
    [ Public <>
        Property <x> Types Integer^;
        Property <y> Types Integer^;
    ]
]

// Good: RGB color value
[ Structure <Color>
    [ Public <>
        Property <r> Types Integer^;
        Property <g> Types Integer^;
        Property <b> Types Integer^;
    ]
]`}</CodeBlock>

      <h3>When to Use Class Instead</h3>
      <ul>
        <li>When inheritance is needed</li>
        <li>For large data structures</li>
        <li>When polymorphism or virtual methods are required</li>
      </ul>

      <CodeBlock language="xxml">{`// Use Class: Needs inheritance
[ Class <Shape> Final Extends None
    [ Public <>
        Method <area> Returns Double^ Parameters () -> { ... }
    ]
]

// Use Class: Large data structure
[ Class <LargeBuffer> Final Extends None
    [ Private <>
        Property <data> Types Array<Integer>^;  // Large array
    ]
]`}</CodeBlock>

      <Callout type="warning">
        Keep structures small (under 64 bytes recommended). Large structures may
        cause stack overflow; use classes for large objects.
      </Callout>

      <h2>Limitations</h2>
      <ul>
        <li>
          <strong>No Inheritance:</strong> Structures cannot use{" "}
          <code>Extends</code>
        </li>
        <li>
          <strong>No Polymorphism:</strong> No virtual methods or dynamic
          dispatch
        </li>
        <li>
          <strong>Stack Size:</strong> Large structures may cause stack overflow
        </li>
        <li>
          <strong>No Final Modifier:</strong> Structures are implicitly final
        </li>
      </ul>

      <h2>Next Steps</h2>
      <p>
        Learn about <a href="/docs/language-reference/classes">Classes</a> for
        heap-allocated objects with inheritance, or explore{" "}
        <a href="/docs/language-reference/generics">Generics</a> for template
        programming.
      </p>
    </>
  );
}
