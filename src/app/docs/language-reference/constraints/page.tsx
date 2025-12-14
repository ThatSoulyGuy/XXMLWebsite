import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Constraints",
  description: "Template parameter requirements in XXML",
};

export default function ConstraintsPage() {
  return (
    <>
      <h1>Constraints</h1>
      <p className="lead">
        Template constraints allow you to specify requirements that template
        type parameters must satisfy, providing compile-time guarantees that
        template arguments have the necessary methods or properties.
      </p>

      <h2>Benefits</h2>
      <ul>
        <li>
          <strong>Type Safety:</strong> Catch errors at compile time instead of
          link time
        </li>
        <li>
          <strong>Better Error Messages:</strong> Clear messages about
          what&apos;s missing
        </li>
        <li>
          <strong>Self-Documenting:</strong> Constraints serve as documentation
        </li>
        <li>
          <strong>Interface Enforcement:</strong> Ensure types conform to
          expected interfaces
        </li>
      </ul>

      <h2>Constraint Declaration</h2>
      <CodeBlock language="xxml">{`[ Constraint <ConstraintName> <T Constrains None> (T a)
    Require (F(ReturnType)(methodName)(*) On a)
]`}</CodeBlock>

      <h3>Syntax Breakdown</h3>
      <ol>
        <li>
          <code>[ Constraint &lt;Name&gt;</code> - Start constraint declaration
        </li>
        <li>
          <code>&lt;T Constrains None&gt;</code> - Template parameters for the
          constraint
        </li>
        <li>
          <code>(T a)</code> - Parameter bindings (maps template param{" "}
          <code>T</code> to identifier <code>a</code>)
        </li>
        <li>
          <code>Require (...)</code> - One or more requirement statements
        </li>
        <li>
          Close with <code>]</code>
        </li>
      </ol>

      <h2>Requirement Types</h2>

      <h3>Method Requirements</h3>
      <p>Require that a type has specific methods with particular signatures:</p>
      <CodeBlock language="xxml">{`Require (F(ReturnType)(methodName)(*) On paramName)`}</CodeBlock>

      <ul>
        <li>
          <code>F</code> - Indicates a function/method requirement
        </li>
        <li>First parentheses - Return type</li>
        <li>Second parentheses - Method name</li>
        <li>
          Third parentheses - <code>*</code> for any parameters, or specific
          parameter types
        </li>
        <li>
          <code>On paramName</code> - Which template parameter this applies to
        </li>
      </ul>

      <CodeBlock language="xxml">{`// Require a method named "toString" returning String^
Require (F(String^)(toString)(*) On a)

// Require a method named "run" returning Integer^
Require (F(Integer^)(run)(*) On a)

// Require a method with specific parameter types
Require (F(Bool^)(equals)(T^) On a)

// Require a method returning None (void)
Require (F(None)(doSomething)(*) On a)`}</CodeBlock>

      <h3>Constructor Requirements</h3>
      <p>Require that a type has specific constructors:</p>
      <CodeBlock language="xxml">{`// Default constructor
Require (C(None) On a)

// Constructor taking an Integer
Require (C(Integer^) On a)

// Constructor taking multiple parameters
Require (C(String^, Integer^) On a)`}</CodeBlock>

      <h3>Truth Requirements</h3>
      <p>Require that a boolean expression is true at compile time:</p>
      <CodeBlock language="xxml">{`// Require that type T is exactly SomeClass
Require (Truth(TypeOf<T>() == TypeOf<SomeClass>()))`}</CodeBlock>

      <h2>Using Constraints</h2>

      <h3>Step 1: Define a Constraint</h3>
      <CodeBlock language="xxml">{`[ Constraint <Printable> <T Constrains None> (T a)
    Require (F(String^)(toString)(*) On a)
]`}</CodeBlock>

      <h3>Step 2: Apply to Template Class</h3>
      <CodeBlock language="xxml">{`// Single constraint
[ Class <Printer> <T Constrains Printable> Final Extends None

// Single constraint with template arguments (two syntaxes)
[ Class <HashSet> <T Constrains Hashable<T>> Final Extends None
[ Class <HashSet> <T Constrains Hashable@T> Final Extends None

// Multiple constraints with AND semantics (must satisfy ALL)
[ Class <HashMap> <K Constrains (Hashable<K>, Equatable@K)> Final Extends None

// Multiple constraints with OR semantics (must satisfy at least ONE)
[ Class <FlexibleContainer> <T Constrains Printable | Comparable> Final Extends None`}</CodeBlock>

      <Callout type="info">
        Use parentheses with commas for AND semantics (all constraints must be
        satisfied). Use pipe <code>|</code> for OR semantics (at least one must
        be satisfied).
      </Callout>

      <h3>Step 3: Instantiate with Valid Types</h3>
      <CodeBlock language="xxml">{`// Integer has toString(), so this works
Instantiate Printer<Integer>^ As <intPrinter> = Printer@Integer::Constructor();

// String has toString(), so this works
Instantiate Printer<String>^ As <strPrinter> = Printer@String::Constructor();`}</CodeBlock>

      <h2>Complete Example: Printable Constraint</h2>
      <CodeBlock language="xxml" filename="printable.xxml">{`[ Constraint <Printable> <T Constrains None> (T a)
    Require (F(String^)(toString)(*) On a)
]

[ Class <Logger> <T Constrains Printable> Final Extends None
    [ Public <>
        Property <items> Types Collections::List<T>^;

        Constructor Parameters() -> {
            Set items = Collections::List@T::Constructor();
        }

        Method <add> Returns None Parameters (Parameter <item> Types T^) Do {
            Run items.add(item);
        }

        Method <logAll> Returns None Parameters () Do {
            For (Integer <i> = 0 .. items.size()) -> {
                Instantiate T^ As <item> = items.get(i);
                Run Console::printLine(item.toString());
            }
        }
    ]
]`}</CodeBlock>

      <h2>Common Constraint Patterns</h2>

      <h3>Comparable</h3>
      <CodeBlock language="xxml">{`[ Constraint <Comparable> <T Constrains None> (T a)
    Require (F(Bool^)(lessThan)(T^) On a)
    Require (F(Bool^)(equals)(T^) On a)
]`}</CodeBlock>

      <h3>Sortable</h3>
      <CodeBlock language="xxml">{`[ Constraint <Sortable> <T Constrains None> (T a)
    Require (F(Bool^)(lessThan)(T^) On a)
    Require (F(Bool^)(greaterThan)(T^) On a)
    Require (F(Bool^)(equals)(T^) On a)
    Require (F(String^)(toString)(*) On a)
]`}</CodeBlock>

      <h3>Hashable (from STL)</h3>
      <CodeBlock language="xxml">{`[ Constraint <Hashable> <T Constrains None> (T a)
    Require (F(NativeType<"int64">^)(hash)(*) On a)
]`}</CodeBlock>

      <h3>Numeric</h3>
      <CodeBlock language="xxml">{`[ Constraint <Numeric> <T Constrains None> (T a)
    Require (F(T^)(add)(T^) On a)
    Require (F(T^)(subtract)(T^) On a)
    Require (F(T^)(multiply)(T^) On a)
    Require (F(T^)(divide)(T^) On a)
]`}</CodeBlock>

      <h2>Constraint Syntax Summary</h2>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Syntax
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Meaning
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>&lt;T Constrains None&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                No constraints
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>&lt;T Constrains Printable&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Single constraint
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>&lt;T Constrains Hashable&lt;T&gt;&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                With template args (angle brackets)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>&lt;T Constrains Hashable@T&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                With template args (at-sign)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>&lt;T Constrains (A, B)&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                AND semantics (must satisfy all)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>&lt;T Constrains A | B&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                OR semantics (satisfy at least one)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Error Handling</h2>
      <p>
        If you try to use a type that doesn&apos;t satisfy the constraint,
        you&apos;ll get a clear compile-time error:
      </p>
      <CodeBlock language="text">{`Error: Type 'MyClass' does not satisfy constraint 'Printable'
Required method: toString`}</CodeBlock>

      <Callout type="tip">
        Add the required method to your class to satisfy the constraint. Ensure
        the method has the correct name, return type, and parameter types.
      </Callout>

      <h2>Best Practices</h2>
      <ul>
        <li>
          <strong>Use minimal requirements:</strong> Only require what you
          actually need
        </li>
        <li>
          <strong>Clear naming:</strong> Use descriptive constraint names like{" "}
          <code>Sortable</code> not <code>S</code>
        </li>
        <li>
          <strong>Document requirements:</strong> Add comments explaining why
          each requirement exists
        </li>
        <li>
          <strong>Test with multiple types:</strong> Verify constraints work
          with various types
        </li>
      </ul>

      <h2>Next Steps</h2>
      <p>
        Learn about <a href="/docs/language-reference/generics">Generics</a> for
        template programming, or explore{" "}
        <a href="/docs/language-reference/classes">Classes</a> to understand how
        constraints are applied.
      </p>
    </>
  );
}
