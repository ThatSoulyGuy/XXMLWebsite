import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Syntax",
  description: "XXML language syntax reference",
};

export default function SyntaxPage() {
  return (
    <>
      <h1>Syntax</h1>
      <p className="lead">
        A comprehensive guide to XXML syntax, including keywords, operators, and
        code structure.
      </p>

      <h2>Keywords</h2>
      <p>XXML uses the following reserved keywords:</p>

      <div className="not-prose my-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {[
          "import",
          "Namespace",
          "Class",
          "Enumeration",
          "Value",
          "Final",
          "Extends",
          "None",
          "Public",
          "Private",
          "Protected",
          "Property",
          "Types",
          "Constructor",
          "default",
          "Method",
          "Returns",
          "Parameters",
          "Parameter",
          "Entrypoint",
          "Instantiate",
          "As",
          "Run",
          "For",
          "While",
          "If",
          "Else",
          "Exit",
          "Return",
          "Break",
          "Continue",
          "Lambda",
          "true",
          "false",
          "Compiletime",
          "Templates",
          "Constrains",
          "Set",
          "Do",
        ].map((keyword) => (
          <code
            key={keyword}
            className="rounded bg-purple-100 px-2 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
          >
            {keyword}
          </code>
        ))}
      </div>

      <h2>Comments</h2>
      <p>XXML supports single-line comments:</p>
      <CodeBlock language="xxml">{`// This is a single-line comment`}</CodeBlock>

      <h2>Identifiers</h2>
      <p>Identifiers in XXML follow these patterns:</p>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Pattern
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Example
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                Regular
              </td>
              <td className="px-4 py-3">
                <code className="text-sm">[a-zA-Z_][a-zA-Z0-9_]*</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                <code>MyClass</code>, <code>counter</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                Angle-bracketed
              </td>
              <td className="px-4 py-3">
                <code className="text-sm">&lt;identifier&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                <code>&lt;name&gt;</code>, <code>&lt;age&gt;</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                Qualified
              </td>
              <td className="px-4 py-3">
                <code className="text-sm">Namespace::Class::Member</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                <code>Language::Core::String</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="info">
        Angle-bracketed identifiers like <code>&lt;name&gt;</code> are used for
        variable declarations, method names, and parameters. This syntax makes
        declarations visually distinct from usage.
      </Callout>

      <h2>Literals</h2>

      <h3>Integer Literals</h3>
      <CodeBlock language="xxml">{`42i      // With suffix
123      // Without suffix`}</CodeBlock>

      <h3>String Literals</h3>
      <CodeBlock language="xxml">{`"hello"
"hello\\nworld"  // Escape sequences supported`}</CodeBlock>

      <h3>Boolean Literals</h3>
      <CodeBlock language="xxml">{`true
false`}</CodeBlock>

      <h2>Operators</h2>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Operators
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Arithmetic
              </td>
              <td className="px-4 py-3">
                <code>+ - * / %</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Math operations
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Comparison
              </td>
              <td className="px-4 py-3">
                <code>== != &lt; &gt; &lt;= &gt;=</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Value comparison
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Logical
              </td>
              <td className="px-4 py-3">
                <code>&& || !</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Boolean logic
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Assignment
              </td>
              <td className="px-4 py-3">
                <code>=</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Value assignment
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Member Access
              </td>
              <td className="px-4 py-3">
                <code>. ::</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Instance/static access
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Range
              </td>
              <td className="px-4 py-3">
                <code>..</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Range creation (exclusive end)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Arrow
              </td>
              <td className="px-4 py-3">
                <code>-&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Block introduction
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Ownership
              </td>
              <td className="px-4 py-3">
                <code>^ & %</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Owned, reference, copy
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Program Structure</h2>

      <h3>Imports</h3>
      <p>
        Import modules using the <code>#import</code> directive:
      </p>
      <CodeBlock language="xxml">{`#import Language::Core;
#import Language::Collections;
#import Language::IO;`}</CodeBlock>

      <h3>Namespaces</h3>
      <p>Organize code into namespaces:</p>
      <CodeBlock language="xxml">{`[ Namespace <MyApp>
    // Declarations go here
]

[ Namespace <Outer::Inner>
    // Nested namespace
]`}</CodeBlock>

      <h3>Entrypoint</h3>
      <p>Every XXML program requires an entrypoint:</p>
      <CodeBlock
        language="xxml"
        filename="main.xxml"
      >{`[ Entrypoint
    {
        // Program starts here
        Run Console::printLine(String::Constructor("Hello!"));
        Exit(0);
    }
]`}</CodeBlock>

      <Callout type="tip">
        The <code>Exit(0)</code> call is required to terminate the program with
        an exit code. Use <code>0</code> for success and non-zero for errors.
      </Callout>

      <h2>Statements</h2>

      <h3>Variable Declaration</h3>
      <p>
        Declare variables using the <code>Instantiate</code> keyword:
      </p>
      <CodeBlock language="xxml">{`// Syntax: Instantiate Type As <variableName> = initializer;

Instantiate Integer^ As <x> = Integer::Constructor(42);
Instantiate String^ As <name> = String::Constructor("Alice");
Instantiate Bool^ As <active> = Bool::Constructor(true);`}</CodeBlock>

      <h3>Assignment</h3>
      <p>
        Reassign variables using the <code>Set</code> keyword:
      </p>
      <CodeBlock language="xxml">{`Set variableName = expression;
Set counter = counter.add(Integer::Constructor(1));`}</CodeBlock>

      <h3>Function Calls</h3>
      <p>
        Execute functions using the <code>Run</code> keyword:
      </p>
      <CodeBlock language="xxml">{`Run Console::printLine(message);
Run object.method(args);
Run list.add(item);`}</CodeBlock>

      <h3>Control Flow</h3>

      <h4>For Loop</h4>
      <CodeBlock language="xxml">{`// Range-based for loop (exclusive end)
For (Integer^ <i> = 0 .. 10) ->
{
    Run Console::printLine(i.toString());
}`}</CodeBlock>

      <h4>While Loop</h4>
      <CodeBlock language="xxml">{`While (condition) ->
{
    // Loop body
}`}</CodeBlock>

      <h4>If/Else</h4>
      <CodeBlock language="xxml">{`If (condition) -> {
    // Then branch
} Else -> {
    // Else branch
}`}</CodeBlock>

      <Callout type="warning">
        Note that XXML uses <code>-&gt;</code> arrows after conditions and loop
        declarations. This is different from C-style syntax.
      </Callout>

      <h3>Return and Exit</h3>
      <CodeBlock language="xxml">{`Return value;    // Return from method
Return;          // Return None
Exit(0);         // Exit program with code`}</CodeBlock>

      <h2>Next Steps</h2>
      <p>
        Now that you understand the basic syntax, learn about{" "}
        <a href="/docs/language-reference/types">XXML&apos;s type system</a> and{" "}
        <a href="/docs/language-reference/ownership">ownership semantics</a>.
      </p>
    </>
  );
}
