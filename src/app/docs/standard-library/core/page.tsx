import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Core Module",
  description: "XXML Language::Core module reference",
};

function ClassHeader({ name, description }: { name: string; description: string }) {
  return (
    <div className="not-prose mb-6 rounded-lg border border-zinc-200 bg-gradient-to-r from-zinc-50 to-white p-4 dark:border-zinc-700 dark:from-zinc-800/50 dark:to-zinc-900">
      <h2 className="m-0 text-xl font-bold text-zinc-900 dark:text-zinc-100" id={name.toLowerCase()}>
        {name}
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">{description}</p>
    </div>
  );
}

function MethodTable({ methods }: { methods: { name: string; params: string; returns: string; desc: string }[] }) {
  return (
    <div className="not-prose my-4 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
            <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-100">Method</th>
            <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-100">Parameters</th>
            <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-100">Returns</th>
            <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-100">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
          {methods.map((m, i) => (
            <tr key={`${m.name}-${i}`} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <td className="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">{m.name}</td>
              <td className="px-4 py-2 font-mono text-zinc-600 dark:text-zinc-300">{m.params || "—"}</td>
              <td className="px-4 py-2 font-mono text-zinc-600 dark:text-zinc-300">{m.returns}</td>
              <td className="px-4 py-2 text-zinc-500 dark:text-zinc-400">{m.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CorePage() {
  return (
    <>
      <h1>Core Module</h1>
      <p className="lead">
        The <code>Language::Core</code> module provides primitive types and interfaces
        that form the foundation of every XXML program.
      </p>

      <CodeBlock language="xxml">{`#import Language::Core;`}</CodeBlock>

      <div className="not-prose my-8 grid gap-2 sm:grid-cols-3">
        {["Integer", "String", "Bool", "Float", "Double", "Hashable", "Equatable"].map((cls) => (
          <a
            key={cls}
            href={`#${cls.toLowerCase()}`}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-center text-sm font-medium text-zinc-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300"
          >
            {cls}
          </a>
        ))}
      </div>

      {/* Integer */}
      <ClassHeader name="Integer" description="64-bit signed integer type with full arithmetic and comparison support." />

      <h3>Constructors</h3>
      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "Integer^", desc: "Creates integer with value 0" },
          { name: "Constructor", params: "val: NativeType<\"int64\">%", returns: "Integer^", desc: "Creates integer from native int64" },
        ]}
      />

      <h3>Arithmetic Operations</h3>
      <MethodTable
        methods={[
          { name: "add", params: "other: Integer&", returns: "Integer^", desc: "Returns sum of this and other" },
          { name: "subtract", params: "other: Integer&", returns: "Integer^", desc: "Returns difference" },
          { name: "multiply", params: "other: Integer&", returns: "Integer^", desc: "Returns product" },
          { name: "divide", params: "other: Integer&", returns: "Integer^", desc: "Returns quotient" },
          { name: "modulo", params: "other: Integer&", returns: "Integer^", desc: "Returns remainder" },
          { name: "negate", params: "", returns: "Integer^", desc: "Returns negated value" },
          { name: "abs", params: "", returns: "Integer^", desc: "Returns absolute value" },
        ]}
      />

      <h3>Assignment Operations</h3>
      <MethodTable
        methods={[
          { name: "addAssign", params: "other: Integer&", returns: "Integer^", desc: "Adds and assigns" },
          { name: "subtractAssign", params: "other: Integer&", returns: "Integer^", desc: "Subtracts and assigns" },
          { name: "multiplyAssign", params: "other: Integer&", returns: "Integer^", desc: "Multiplies and assigns" },
          { name: "divideAssign", params: "other: Integer&", returns: "Integer^", desc: "Divides and assigns" },
          { name: "moduloAssign", params: "other: Integer&", returns: "Integer^", desc: "Modulo and assigns" },
        ]}
      />

      <h3>Comparison Operations</h3>
      <MethodTable
        methods={[
          { name: "equals", params: "other: Integer&", returns: "Bool^", desc: "Tests equality" },
          { name: "lessThan", params: "other: Integer&", returns: "Bool^", desc: "Tests if less than" },
          { name: "greaterThan", params: "other: Integer&", returns: "Bool^", desc: "Tests if greater than" },
          { name: "lessOrEqual", params: "other: Integer&", returns: "Bool^", desc: "Tests if less or equal" },
          { name: "greaterOrEqual", params: "other: Integer&", returns: "Bool^", desc: "Tests if greater or equal" },
        ]}
      />

      <h3>Conversion</h3>
      <MethodTable
        methods={[
          { name: "toInt64", params: "", returns: "NativeType<\"int64\">%", desc: "Returns raw int64 value" },
          { name: "toInt32", params: "", returns: "NativeType<\"int32\">^", desc: "Returns as int32" },
          { name: "toString", params: "", returns: "String^", desc: "Converts to string representation" },
          { name: "hash", params: "", returns: "NativeType<\"int64\">^", desc: "Returns hash code (Hashable)" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Integer^ As <a> = Integer::Constructor(10);
Instantiate Integer^ As <b> = Integer::Constructor(3);

Instantiate Integer^ As <sum> = a.add(b);           // 13
Instantiate Integer^ As <product> = a.multiply(b);  // 30
Instantiate Integer^ As <absolute> = a.negate().abs(); // 10

Run System::Console::printLine(sum.toString());`}</CodeBlock>

      {/* String */}
      <ClassHeader name="String" description="Owned string type with memory management. Marked as Compiletime Final." />

      <h3>Constructors</h3>
      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "String^", desc: "Creates empty string" },
          { name: "Constructor", params: "cstr: NativeType<\"cstr\">%", returns: "String^", desc: "Creates from C string literal" },
          { name: "FromCString", params: "ptr: NativeType<\"ptr\">", returns: "String^", desc: "Creates from pointer" },
        ]}
      />

      <h3>Properties & Access</h3>
      <MethodTable
        methods={[
          { name: "length", params: "", returns: "Integer^", desc: "Returns character count" },
          { name: "isEmpty", params: "", returns: "Bool^", desc: "Returns true if length is 0" },
          { name: "charAt", params: "index: Integer&", returns: "String^", desc: "Returns character at index" },
          { name: "toCString", params: "", returns: "NativeType<\"cstr\">%", desc: "Returns raw C string pointer" },
        ]}
      />

      <h3>Operations</h3>
      <MethodTable
        methods={[
          { name: "append", params: "other: String&", returns: "String^", desc: "Concatenates strings" },
          { name: "copy", params: "", returns: "String^", desc: "Creates a deep copy" },
          { name: "equals", params: "other: String&", returns: "Bool^", desc: "Tests string equality" },
          { name: "hash", params: "", returns: "NativeType<\"int64\">^", desc: "Returns hash code" },
          { name: "dispose", params: "", returns: "None", desc: "Frees underlying memory" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate String^ As <greeting> = String::Constructor("Hello");
Instantiate String^ As <name> = String::Constructor("World");

Instantiate String^ As <message> = greeting.append(String::Constructor(", ")).append(name);
Instantiate Integer^ As <len> = message.length();

If (message.isEmpty().not().toBool())
{
    Run System::Console::printLine(message);
}`}</CodeBlock>

      {/* Bool */}
      <ClassHeader name="Bool" description="Boolean type representing true or false values." />

      <h3>Constructors</h3>
      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "Bool^", desc: "Creates false value" },
          { name: "Constructor", params: "val: NativeType<\"bool\">%", returns: "Bool^", desc: "Creates from native bool" },
        ]}
      />

      <h3>Logical Operations</h3>
      <MethodTable
        methods={[
          { name: "and", params: "other: Bool&", returns: "Bool^", desc: "Logical AND" },
          { name: "or", params: "other: Bool&", returns: "Bool^", desc: "Logical OR" },
          { name: "not", params: "", returns: "Bool^", desc: "Logical NOT" },
          { name: "xor", params: "other: Bool&", returns: "Bool^", desc: "Exclusive OR" },
        ]}
      />

      <h3>Comparison & Conversion</h3>
      <MethodTable
        methods={[
          { name: "equals", params: "other: Bool&", returns: "Bool^", desc: "Tests equality" },
          { name: "toBool", params: "", returns: "NativeType<\"bool\">%", desc: "Returns raw boolean" },
          { name: "getValue", params: "", returns: "NativeType<\"bool\">%", desc: "Alias for toBool" },
          { name: "toInteger", params: "", returns: "Integer^", desc: "Returns 1 for true, 0 for false" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Bool^ As <a> = Bool::Constructor(true);
Instantiate Bool^ As <b> = Bool::Constructor(false);

Instantiate Bool^ As <result> = a.and(b);     // false
Instantiate Bool^ As <either> = a.or(b);      // true
Instantiate Bool^ As <negated> = a.not();     // false

If (a.toBool())
{
    Run System::Console::printLine(String::Constructor("a is true"));
}`}</CodeBlock>

      {/* Float */}
      <ClassHeader name="Float" description="32-bit single-precision floating point number." />

      <h3>Constructors</h3>
      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "Float^", desc: "Creates 0.0 value" },
          { name: "Constructor", params: "val: NativeType<\"float\">%", returns: "Float^", desc: "Creates from native float" },
        ]}
      />

      <h3>Arithmetic Operations</h3>
      <MethodTable
        methods={[
          { name: "add", params: "other: Float&", returns: "Float^", desc: "Addition" },
          { name: "subtract", params: "other: Float&", returns: "Float^", desc: "Subtraction" },
          { name: "multiply", params: "other: Float&", returns: "Float^", desc: "Multiplication" },
          { name: "divide", params: "other: Float&", returns: "Float^", desc: "Division" },
          { name: "negate", params: "", returns: "Float^", desc: "Negation" },
          { name: "abs", params: "", returns: "Float^", desc: "Absolute value" },
        ]}
      />

      <h3>Comparison</h3>
      <MethodTable
        methods={[
          { name: "equals", params: "other: Float&", returns: "Bool^", desc: "Tests equality" },
          { name: "lessThan", params: "other: Float&", returns: "Bool^", desc: "Less than comparison" },
          { name: "greaterThan", params: "other: Float&", returns: "Bool^", desc: "Greater than comparison" },
        ]}
      />

      <h3>Conversion</h3>
      <MethodTable
        methods={[
          { name: "toFloat", params: "", returns: "NativeType<\"float\">%", desc: "Returns raw float" },
          { name: "toInteger", params: "", returns: "Integer^", desc: "Converts to Integer (truncates)" },
          { name: "toDouble", params: "", returns: "Double", desc: "Converts to Double" },
          { name: "toString", params: "", returns: "String^", desc: "String representation" },
        ]}
      />

      {/* Double */}
      <ClassHeader name="Double" description="64-bit double-precision floating point number." />

      <h3>Constructors</h3>
      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "Double^", desc: "Creates 0.0 value" },
          { name: "Constructor", params: "val: NativeType<\"double\">%", returns: "Double^", desc: "Creates from native double" },
        ]}
      />

      <h3>Arithmetic Operations</h3>
      <MethodTable
        methods={[
          { name: "add", params: "other: Double&", returns: "Double^", desc: "Addition" },
          { name: "subtract", params: "other: Double&", returns: "Double^", desc: "Subtraction" },
          { name: "multiply", params: "other: Double&", returns: "Double^", desc: "Multiplication" },
          { name: "divide", params: "other: Double&", returns: "Double^", desc: "Division" },
          { name: "negate", params: "", returns: "Double^", desc: "Negation" },
          { name: "abs", params: "", returns: "Double^", desc: "Absolute value" },
        ]}
      />

      <h3>Comparison</h3>
      <MethodTable
        methods={[
          { name: "equals", params: "other: Double&", returns: "Bool^", desc: "Tests equality" },
          { name: "lessThan", params: "other: Double&", returns: "Bool^", desc: "Less than" },
          { name: "greaterThan", params: "other: Double&", returns: "Bool^", desc: "Greater than" },
          { name: "lessOrEqual", params: "other: Double&", returns: "Bool^", desc: "Less or equal" },
          { name: "greaterOrEqual", params: "other: Double&", returns: "Bool^", desc: "Greater or equal" },
        ]}
      />

      <h3>Conversion</h3>
      <MethodTable
        methods={[
          { name: "toDouble", params: "", returns: "NativeType<\"double\">%", desc: "Returns raw double" },
          { name: "getValue", params: "", returns: "NativeType<\"double\">%", desc: "Alias for toDouble" },
          { name: "toInteger", params: "", returns: "Integer^", desc: "Converts to Integer" },
          { name: "toFloat", params: "", returns: "Float", desc: "Converts to Float" },
          { name: "toString", params: "", returns: "String^", desc: "String representation" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Double^ As <pi> = Double::Constructor(3.14159265359);
Instantiate Double^ As <radius> = Double::Constructor(5.0);

Instantiate Double^ As <area> = pi.multiply(radius).multiply(radius);
Run System::Console::printLine(area.toString());`}</CodeBlock>

      {/* Interfaces */}
      <ClassHeader name="Hashable" description="Constraint interface for types that can be used as HashMap keys or Set elements." />

      <p>
        Types implementing <code>Hashable</code> must provide a <code>hash()</code> method
        that returns a consistent integer value for the same object.
      </p>

      <CodeBlock language="xxml">{`[ Constraint <Hashable> <T Constrains None>
    Method <hash> Returns NativeType<"int64">^ Parameters ()
]`}</CodeBlock>

      <Callout type="info">
        Hash implementations must be deterministic—calling <code>hash()</code> multiple times
        on the same object must return the same value. Built-in types like <code>Integer</code> and
        <code>String</code> already implement this constraint.
      </Callout>

      <ClassHeader name="Equatable" description="Constraint interface for types that support equality comparison." />

      <p>
        Types implementing <code>Equatable</code> must provide an <code>equals()</code> method.
        Required for HashMap key comparison and general equality testing.
      </p>

      <CodeBlock language="xxml">{`[ Constraint <Equatable> <T Constrains None>
    Method <equals> Returns Bool^ Parameters (Parameter <other> Types NativeType<"ptr">^)
]`}</CodeBlock>

      <Callout type="info">
        Equality implementations should be reflexive (x.equals(x) is true), symmetric
        (x.equals(y) implies y.equals(x)), and transitive.
      </Callout>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="core_example.xxml" showLineNumbers>{`#import Language::Core;
#import Language::System;

[ Entrypoint
    {
        // Integer arithmetic
        Instantiate Integer^ As <x> = Integer::Constructor(42);
        Instantiate Integer^ As <y> = Integer::Constructor(8);
        Instantiate Integer^ As <sum> = x.add(y);

        // Floating point
        Instantiate Double^ As <pi> = Double::Constructor(3.14159);
        Instantiate Double^ As <squared> = pi.multiply(pi);

        // String operations
        Instantiate String^ As <result> = String::Constructor("Result: ");
        Set result = result.append(sum.toString());

        // Boolean logic
        Instantiate Bool^ As <isPositive> = x.greaterThan(Integer::Constructor(0));

        If (isPositive.toBool())
        {
            Run System::Console::printLine(result);
        }

        Exit(0);
    }
]`}</CodeBlock>

      <h2>See Also</h2>
      <div className="not-prose mt-4 flex flex-wrap gap-2">
        <a href="/docs/standard-library/collections" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Collections Module
        </a>
        <a href="/docs/standard-library/system" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          System Module
        </a>
        <a href="/docs/language-reference/types" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Type System
        </a>
      </div>
    </>
  );
}
