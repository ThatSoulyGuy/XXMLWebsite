import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Types",
  description: "XXML type system reference",
};

export default function TypesPage() {
  return (
    <>
      <h1>Types</h1>
      <p className="lead">
        XXML is a statically typed language with a rich type system including
        primitives, classes, enumerations, and generics.
      </p>

      <h2>Primitive Types</h2>

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
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Example
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3">
                <code className="rounded bg-blue-100 px-2 py-1 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  Integer
                </code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                64-bit signed integer
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <code>Integer::Constructor(42)</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">
                <code className="rounded bg-green-100 px-2 py-1 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  String
                </code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                UTF-8 string
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <code>String::Constructor(&quot;Hello&quot;)</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">
                <code className="rounded bg-purple-100 px-2 py-1 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  Bool
                </code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                Boolean (true/false)
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <code>Bool::Constructor(true)</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">
                <code className="rounded bg-zinc-100 px-2 py-1 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                  None
                </code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                No value (void equivalent)
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Used for methods with no return
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Type Declarations</h2>

      <h3>Property Types</h3>
      <p>Properties are declared with their type and ownership modifier:</p>
      <CodeBlock language="xxml">{`Property <name> Types String^;
Property <age> Types Integer^;
Property <active> Types Bool^;`}</CodeBlock>

      <h3>Parameter Types</h3>
      <p>Parameters include ownership modifiers that control how values are passed:</p>
      <CodeBlock language="xxml">{`Parameter <value> Types Integer%   // Copy - receives independent copy
Parameter <message> Types String&  // Reference - borrows without ownership
Parameter <data> Types T^          // Owned - takes ownership`}</CodeBlock>

      <h3>Return Types</h3>
      <CodeBlock language="xxml">{`Method <getName> Returns String^ Parameters ()
Method <calculate> Returns Integer^ Parameters (Parameter <x> Types Integer%)
Method <process> Returns None Parameters ()`}</CodeBlock>

      <h2>Ownership Modifiers</h2>
      <p>Every type reference includes an ownership modifier:</p>

      <div className="not-prose my-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
          <code className="text-2xl font-bold text-blue-600">^</code>
          <h4 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100">
            Owned
          </h4>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
            Unique ownership, manages lifetime
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
          <code className="text-2xl font-bold text-purple-600">&amp;</code>
          <h4 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100">
            Reference
          </h4>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
            Borrowed, non-owning access
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
          <code className="text-2xl font-bold text-green-600">%</code>
          <h4 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100">
            Copy
          </h4>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
            Independent value copy
          </p>
        </div>
      </div>

      <CodeBlock language="xxml">{`// Owned - this variable owns the data
Instantiate String^ As <ownedString> = String::Constructor("Hello");

// Reference - borrows without owning
Method <print> Returns None Parameters (Parameter <msg> Types String&) Do
{
    Run Console::printLine(msg);
}

// Copy - creates independent copy
Method <process> Returns Integer^ Parameters (Parameter <value> Types Integer%) Do
{
    Return value.multiply(Integer::Constructor(2));
}`}</CodeBlock>

      <Callout type="info">
        See the <a href="/docs/language-reference/ownership">Ownership</a> page
        for detailed information on ownership semantics.
      </Callout>

      <h2>Native Types</h2>
      <p>XXML provides low-level native types for FFI and system programming:</p>

      <CodeBlock language="xxml">{`NativeType<"int64">   // 64-bit integer
NativeType<"ptr">     // Raw pointer
NativeType<"float64"> // 64-bit float`}</CodeBlock>

      <Callout type="warning">
        Native types bypass XXML&apos;s safety guarantees. Use them carefully when
        interfacing with C libraries or system calls.
      </Callout>

      <h2>Enumerations</h2>
      <p>Enumerations define a set of named integer constants:</p>

      <CodeBlock language="xxml" filename="enums.xxml">{`[ Enumeration <Color>
    Value <RED> = 1;
    Value <GREEN> = 2;
    Value <BLUE> = 3;
]

[ Enumeration <Key>
    Value <SPACE> = 32;
    Value <A> = 65;
    Value <B>;      // Auto-increment: 66
    Value <C>;      // Auto-increment: 67
]

// Usage
If (keyCode.equals(Key::SPACE)) -> {
    Run Console::printLine(String::Constructor("Space pressed"));
}`}</CodeBlock>

      <h2>Generic Types</h2>
      <p>Types can be parameterized with type arguments:</p>

      <CodeBlock language="xxml">{`// Generic class
[ Class <Box> <T Constrains None> Final Extends None
    [ Public <>
        Property <value> Types T^;
    ]
]

// Using generic types
Instantiate Collections::List<Integer>^ As <numbers> =
    Collections::List@Integer::Constructor();

Instantiate Collections::HashMap<String, Integer>^ As <ages> =
    Collections::HashMap@String, Integer::Constructor();`}</CodeBlock>

      <Callout type="tip">
        Note the different syntax: use <code>&lt;Type&gt;</code> for type
        declarations and <code>@Type</code> for constructor calls.
      </Callout>

      <h2>Function Types</h2>
      <p>
        Function references use the <code>F(ReturnType)(ParamTypes...)</code>{" "}
        syntax:
      </p>

      <CodeBlock language="xxml">{`// Function that takes Integer& and returns Integer^
F(Integer^)(Integer&)

// Function that takes no params and returns String^
F(String^)()

// Function that takes two params
F(Integer^)(Integer&, Integer&)

// Usage with lambda
Instantiate F(Integer^)(Integer&)^ As <doubler> = [ Lambda [] Returns Integer^ Parameters (
    Parameter <n> Types Integer&
) {
    Return n.multiply(Integer::Constructor(2));
}];`}</CodeBlock>

      <h2>Type Summary</h2>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Syntax
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Example
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Primitive
              </td>
              <td className="px-4 py-3">
                <code>TypeName</code>
              </td>
              <td className="px-4 py-3">
                <code>Integer^</code>, <code>String&amp;</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Generic
              </td>
              <td className="px-4 py-3">
                <code>Type&lt;T&gt;</code>
              </td>
              <td className="px-4 py-3">
                <code>List&lt;Integer&gt;^</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Function
              </td>
              <td className="px-4 py-3">
                <code>F(Ret)(Params)</code>
              </td>
              <td className="px-4 py-3">
                <code>F(Integer^)(String&amp;)^</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Native
              </td>
              <td className="px-4 py-3">
                <code>NativeType&lt;&quot;name&quot;&gt;</code>
              </td>
              <td className="px-4 py-3">
                <code>NativeType&lt;&quot;int64&quot;&gt;</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Next Steps</h2>
      <p>
        Learn more about{" "}
        <a href="/docs/language-reference/ownership">ownership semantics</a> and{" "}
        <a href="/docs/language-reference/generics">generic programming</a>.
      </p>
    </>
  );
}
