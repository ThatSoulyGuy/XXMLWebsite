import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Compile-Time Evaluation",
  description: "Compile-time constant evaluation in XXML",
};

export default function CompiletimePage() {
  return (
    <>
      <h1>Compile-Time Evaluation</h1>
      <p className="lead">
        XXML supports compile-time evaluation, allowing expressions to be
        computed during compilation rather than at runtime. This enables
        constant folding, type-safe compile-time constants, and optimization
        opportunities.
      </p>

      <h2>Basic Syntax</h2>
      <p>
        Use the <code>Compiletime</code> keyword after <code>Instantiate</code>{" "}
        to declare a compile-time constant:
      </p>
      <CodeBlock language="xxml">{`Instantiate Compiletime Integer^ As <x> = Integer::Constructor(10);
Instantiate Compiletime Bool^ As <flag> = Bool::Constructor(true);
Instantiate Compiletime String^ As <name> = String::Constructor("Hello");`}</CodeBlock>

      <h2>Supported Types</h2>
      <p>
        The following built-in types are declared as <code>Compiletime</code>{" "}
        classes and support compile-time evaluation:
      </p>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Integer</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                64-bit signed integers
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Float</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                32-bit floating point
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Double</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                64-bit floating point
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Bool</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Boolean values
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>String</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                String values
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Compile-Time Operations</h2>

      <h3>Integer Methods</h3>
      <CodeBlock language="xxml">{`Instantiate Compiletime Integer^ As <x> = Integer::Constructor(10);
Instantiate Compiletime Integer^ As <y> = Integer::Constructor(5);

// Arithmetic
Instantiate Compiletime Integer^ As <sum> = x.add(y);        // 15
Instantiate Compiletime Integer^ As <diff> = x.subtract(y);  // 5
Instantiate Compiletime Integer^ As <prod> = x.multiply(y);  // 50
Instantiate Compiletime Integer^ As <quot> = x.divide(y);    // 2
Instantiate Compiletime Integer^ As <rem> = x.modulo(y);     // 0

// Comparisons (return Bool)
Instantiate Compiletime Bool^ As <eq> = x.equals(y);         // false
Instantiate Compiletime Bool^ As <lt> = x.lessThan(y);       // false
Instantiate Compiletime Bool^ As <gt> = x.greaterThan(y);    // true

// Properties
Instantiate Compiletime Bool^ As <isZ> = x.isZero();         // false
Instantiate Compiletime Bool^ As <isP> = x.isPositive();     // true
Instantiate Compiletime Bool^ As <isE> = x.isEven();         // true

// Conversions
Instantiate Compiletime String^ As <str> = x.toString();     // "10"`}</CodeBlock>

      <h3>Bool Methods</h3>
      <CodeBlock language="xxml">{`Instantiate Compiletime Bool^ As <a> = Bool::Constructor(true);
Instantiate Compiletime Bool^ As <b> = Bool::Constructor(false);

// Logical operations
Instantiate Compiletime Bool^ As <notA> = a.not();           // false
Instantiate Compiletime Bool^ As <andR> = a.and(b);          // false
Instantiate Compiletime Bool^ As <orR> = a.or(b);            // true
Instantiate Compiletime Bool^ As <xorR> = a.xor(b);          // true

// Conversions
Instantiate Compiletime String^ As <str> = a.toString();     // "true"
Instantiate Compiletime Integer^ As <int> = a.toInteger();   // 1`}</CodeBlock>

      <h3>String Methods</h3>
      <CodeBlock language="xxml">{`Instantiate Compiletime String^ As <s> = String::Constructor("Hello World");

// Properties
Instantiate Compiletime Integer^ As <len> = s.length();      // 11
Instantiate Compiletime Bool^ As <empty> = s.isEmpty();      // false

// Transformations
Instantiate Compiletime String^ As <up> = s.toUpperCase();   // "HELLO WORLD"
Instantiate Compiletime String^ As <lo> = s.toLowerCase();   // "hello world"
Instantiate Compiletime String^ As <rv> = s.reverse();       // "dlroW olleH"

// String operations
Instantiate Compiletime String^ As <cat> = s.append(String::Constructor("!"));
Instantiate Compiletime Bool^ As <has> = s.contains(String::Constructor("World"));
Instantiate Compiletime Integer^ As <idx> = s.indexOf(String::Constructor("o"));`}</CodeBlock>

      <h2>Chained Operations</h2>
      <p>Compile-time operations can be chained:</p>
      <CodeBlock language="xxml">{`Instantiate Compiletime Integer^ As <a> = Integer::Constructor(2);
Instantiate Compiletime Integer^ As <b> = Integer::Constructor(3);
Instantiate Compiletime Integer^ As <c> = Integer::Constructor(4);

// (a + b) * c = (2 + 3) * 4 = 20
Instantiate Compiletime Integer^ As <result> = a.add(b).multiply(c);`}</CodeBlock>

      <Callout type="info">
        The entire chain is evaluated at compile-time, resulting in a single
        constant value in the generated code.
      </Callout>

      <h2>Mixed Compile-Time and Runtime</h2>
      <p>Compile-time values can be used with runtime values:</p>
      <CodeBlock language="xxml">{`Instantiate Compiletime Integer^ As <factor> = Integer::Constructor(10);
Instantiate Integer^ As <runtime> = Integer::Constructor(5);

// Compile-time value used in runtime expression
Instantiate Integer^ As <result> = runtime.multiply(factor);  // 50`}</CodeBlock>

      <h2>User-Defined Compile-Time Classes</h2>
      <p>
        Classes can be marked as <code>Compiletime</code> to enable full
        compile-time constructor and method evaluation:
      </p>
      <CodeBlock language="xxml" filename="point.xxml">{`[ Class <Point> Compiletime Final Extends None
    [ Private <>
        Property <x> Types Integer^;
        Property <y> Types Integer^;
    ]

    [ Public <>
        Constructor = default;

        Constructor Parameters (
            Parameter <px> Types Integer^,
            Parameter <py> Types Integer^
        ) -> {
            Set x = px;
            Set y = py;
        }

        Method <getX> Returns Integer^ Parameters () -> {
            Return x;
        }

        Method <getY> Returns Integer^ Parameters () -> {
            Return y;
        }
    ]
]

[ Entrypoint
    {
        // Create Point at compile-time
        Instantiate Compiletime Point^ As <p> = Point::Constructor(
            Integer::Constructor(10),
            Integer::Constructor(20)
        );

        // These method calls are evaluated at compile-time!
        Run Console::printLine(String::Constructor("x = ").append(p.getX().toString()));
        Run Console::printLine(String::Constructor("y = ").append(p.getY().toString()));

        Exit(0);
    }
]`}</CodeBlock>

      <h3>Generated LLVM IR</h3>
      <p>
        The above code generates optimized IR where method calls are completely
        eliminated:
      </p>
      <CodeBlock language="llvm">{`; String constants directly embedded - no runtime method calls!
@.str.1 = private constant [5 x i8] c"x = \\00"
@.str.2 = private constant [3 x i8] c"10\\00"   ; p.getX().toString() folded to "10"
@.str.3 = private constant [5 x i8] c"y = \\00"
@.str.4 = private constant [3 x i8] c"20\\00"   ; p.getY().toString() folded to "20"

define i32 @main() {
  ; No Point_getX, Point_getY, or Integer_toString calls!
  %ct.str = call ptr @String_Constructor(ptr @.str.2)
  ; ...
}`}</CodeBlock>

      <h2>Compile-Time Methods</h2>
      <p>Individual methods can be marked as compile-time:</p>
      <CodeBlock language="xxml">{`[ Class <Math> Final Extends None
    [ Public <>
        Method <factorial> Compiletime Returns Integer^ Parameters (
            Parameter <n> Types Integer^
        ) Do {
            If (n.lessOrEqual(Integer::Constructor(1))) -> {
                Return Integer::Constructor(1);
            }
            Return n.multiply(factorial(n.subtract(Integer::Constructor(1))));
        }
    ]
]`}</CodeBlock>

      <h2>Benefits</h2>
      <ul>
        <li>
          <strong>Performance:</strong> Expressions computed at compile-time
          have zero runtime overhead
        </li>
        <li>
          <strong>Type Safety:</strong> Compile-time evaluation catches errors
          during compilation
        </li>
        <li>
          <strong>Optimization:</strong> The compiler can optimize based on
          known constant values
        </li>
        <li>
          <strong>Code Clarity:</strong> Clearly marks values that are constant
          throughout execution
        </li>
      </ul>

      <Callout type="tip">
        Use compile-time evaluation for configuration constants, lookup tables,
        and any values that can be determined at build time.
      </Callout>

      <h2>Supported Statements</h2>
      <p>
        The following statement types are supported in compile-time
        method/constructor bodies:
      </p>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Statement
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Set x = expr</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Property or variable assignment
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Instantiate Type As &lt;var&gt; = expr</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Local variable declaration
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Return expr</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Return statement
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Run expr</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Expression statement
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Limitations</h2>
      <ul>
        <li>
          Compile-time values must be initialized with compile-time evaluable
          expressions
        </li>
        <li>I/O operations cannot be performed at compile-time</li>
        <li>Compile-time class methods must have deterministic behavior</li>
        <li>
          Recursive compile-time methods have depth limits to prevent infinite
          loops
        </li>
        <li>External/native functions cannot be called at compile-time</li>
        <li>
          Control flow statements (<code>If</code>, <code>While</code>,{" "}
          <code>For</code>) in compile-time methods are not yet supported
        </li>
      </ul>

      <h2>Next Steps</h2>
      <p>
        Learn about <a href="/docs/language-reference/types">Types</a> for more
        information about XXML&apos;s type system, or explore{" "}
        <a href="/docs/advanced">Advanced Topics</a> for more compiler features.
      </p>
    </>
  );
}
