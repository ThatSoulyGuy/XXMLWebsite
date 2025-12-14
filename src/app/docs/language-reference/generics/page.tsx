import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Generics",
  description: "XXML templates and generic programming",
};

export default function GenericsPage() {
  return (
    <>
      <h1>Generics (Templates)</h1>
      <p className="lead">
        XXML supports generic programming through templates, allowing you to
        write type-safe, reusable code that works with multiple types.
      </p>

      <h2>Template Classes</h2>
      <p>
        Template parameters are declared inline with the class name using angle
        brackets:
      </p>

      <CodeBlock language="xxml" filename="box.xxml">{`[ Class <Box> <T Constrains None> Final Extends None
    [ Public <>
        Property <value> Types T^;

        Constructor Parameters (Parameter <v> Types T^) ->
        {
            Set value = v;
        }

        Method <get> Returns T^ Parameters () Do
        {
            Return value;
        }
    ]
]`}</CodeBlock>

      <h3>Multiple Type Parameters</h3>
      <p>Classes can have multiple type parameters separated by commas:</p>

      <CodeBlock language="xxml">{`[ Class <Pair> <First Constrains None, Second Constrains None> Final Extends None
    [ Public <>
        Property <first> Types First^;
        Property <second> Types Second^;

        Constructor Parameters (
            Parameter <f> Types First^,
            Parameter <s> Types Second^
        ) ->
        {
            Set first = f;
            Set second = s;
        }
    ]
]`}</CodeBlock>

      <h2>Template Instantiation</h2>
      <p>XXML uses two syntaxes for template instantiation:</p>

      <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <code className="text-lg font-semibold text-blue-700 dark:text-blue-300">
            &lt;Type&gt;
          </code>
          <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
            For type declarations
          </p>
          <code className="mt-2 block text-xs text-blue-600 dark:text-blue-400">
            Box&lt;Integer&gt;^
          </code>
        </div>
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <code className="text-lg font-semibold text-purple-700 dark:text-purple-300">
            @Type
          </code>
          <p className="mt-2 text-sm text-purple-800 dark:text-purple-200">
            For constructor calls
          </p>
          <code className="mt-2 block text-xs text-purple-600 dark:text-purple-400">
            Box@Integer::Constructor()
          </code>
        </div>
      </div>

      <CodeBlock language="xxml">{`// Type declaration uses angle brackets
Instantiate Box<Integer>^ As <intBox> =
    // Constructor uses @ syntax
    Box@Integer::Constructor(Integer::Constructor(42));

Instantiate Pair<String, Integer>^ As <entry> =
    Pair@String, Integer::Constructor(
        String::Constructor("age"),
        Integer::Constructor(25)
    );`}</CodeBlock>

      <Callout type="info">
        The <code>@</code> syntax for constructors helps disambiguate generic
        type instantiation from comparison operators in complex expressions.
      </Callout>

      <h2>Template Constraints</h2>
      <p>
        Constraints ensure that type parameters have required methods or
        properties. They provide compile-time guarantees about what operations
        are available on generic types.
      </p>

      <h3>Defining a Constraint</h3>

      <CodeBlock language="xxml" filename="constraints.xxml">{`[ Constraint <Printable> <T Constrains None> (T a)
    Require (F(String^)(toString)(*) On a)
]

[ Constraint <Comparable> <T Constrains None> (T a)
    Require (F(Bool^)(lessThan)(T^) On a)
    Require (F(Bool^)(equals)(T^) On a)
]`}</CodeBlock>

      <h3>Using Constraints</h3>

      <CodeBlock language="xxml">{`// Single constraint
[ Class <Printer> <T Constrains Printable> Final Extends None
    [ Public <>
        Method <print> Returns None Parameters (Parameter <value> Types T^) Do
        {
            Run Console::printLine(value.toString());
        }
    ]
]

// Constraint with template arguments (two equivalent syntaxes)
[ Class <HashSet> <T Constrains Hashable<T>> Final Extends None
    // ...
]

[ Class <HashSet> <T Constrains Hashable@T> Final Extends None
    // ...
]`}</CodeBlock>

      <h3>Multiple Constraints</h3>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Syntax
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Semantics
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3">
                <code>(A, B)</code>
              </td>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                AND
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                All constraints must be satisfied
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">
                <code>A | B</code>
              </td>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                OR
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                At least one constraint must be satisfied
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <CodeBlock language="xxml">{`// AND semantics - all constraints must be satisfied
[ Class <SortedMap> <K Constrains (Hashable<K>, Comparable@K), V Constrains None> Final Extends None
    // K must be both Hashable AND Comparable
]

// OR semantics - at least one constraint must be satisfied
[ Class <FlexibleContainer> <T Constrains Printable | Comparable> Final Extends None
    // T must be either Printable OR Comparable (or both)
]`}</CodeBlock>

      <h2>Method Templates</h2>
      <p>
        Methods can have their own type parameters independent of the class:
      </p>

      <CodeBlock language="xxml">{`[ Class <Converter> Final Extends None
    [ Public <>
        Constructor = default;

        Method <identity> Templates <T Constrains None> Returns T^ Parameters (
            Parameter <value> Types T^
        ) Do
        {
            Return value;
        }

        Method <convert> Templates <From Constrains None, To Constrains None> Returns To^ Parameters (
            Parameter <value> Types From^
        ) Do
        {
            // Conversion logic
        }
    ]
]

// Calling template methods
Instantiate Converter^ As <c> = Converter::Constructor();
Instantiate Integer^ As <result> = c.identity<Integer>(Integer::Constructor(42));`}</CodeBlock>

      <h2>Lambda Templates</h2>
      <p>Lambdas can also be generic:</p>

      <CodeBlock language="xxml">{`// Generic lambda
Instantiate __function^ As <identity> = [ Lambda [] Templates <T Constrains None> Returns T^ Parameters (
    Parameter <x> Types T^
) {
    Return x;
}];

// Calling with type argument
Instantiate Integer^ As <intResult> = identity<Integer>.call(Integer::Constructor(42));
Instantiate String^ As <strResult> = identity<String>.call(String::Constructor("Hello"));`}</CodeBlock>

      <Callout type="tip">
        Generic lambdas are useful for creating reusable utility functions that
        work with any type, like <code>identity</code>, <code>compose</code>, or{" "}
        <code>pipe</code>.
      </Callout>

      <h2>Complete Example: Generic Stack</h2>

      <CodeBlock language="xxml" filename="stack.xxml" showLineNumbers>{`[ Class <Stack> <T Constrains None> Final Extends None
    [ Private <>
        Property <items> Types Collections::List<T>^;
    ]

    [ Public <>
        Constructor Parameters() ->
        {
            Set items = Collections::List@T::Constructor();
        }

        Method <push> Returns None Parameters (Parameter <value> Types T^) Do
        {
            Run items.add(value);
        }

        Method <pop> Returns T^ Parameters () Do
        {
            Instantiate Integer^ As <lastIdx> = items.size().subtract(Integer::Constructor(1));
            Instantiate T^ As <value> = items.get(lastIdx);
            Run items.removeAt(lastIdx);
            Return value;
        }

        Method <isEmpty> Returns Bool^ Parameters () Do
        {
            Return items.size().equals(Integer::Constructor(0));
        }
    ]
]

[ Entrypoint
    {
        Instantiate Stack<String>^ As <stack> = Stack@String::Constructor();
        Run stack.push(String::Constructor("First"));
        Run stack.push(String::Constructor("Second"));

        Run Console::printLine(stack.pop());  // Prints: Second
        Run Console::printLine(stack.pop());  // Prints: First

        Exit(0);
    }
]`}</CodeBlock>

      <h2>Best Practices</h2>
      <ul>
        <li>
          <strong>Use constraints</strong> to document and enforce type
          requirements
        </li>
        <li>
          <strong>Prefer specific constraints</strong> over{" "}
          <code>Constrains None</code> when possible
        </li>
        <li>
          <strong>Use meaningful type parameter names</strong> like{" "}
          <code>Key</code>, <code>Value</code>, <code>Element</code>
        </li>
        <li>
          <strong>Consider ownership</strong> when designing generic containers
        </li>
      </ul>

      <h2>Next Steps</h2>
      <p>
        Learn about <a href="/docs/language-reference/classes">classes</a> and{" "}
        <a href="/docs/language-reference/lambdas">lambdas</a> to see how
        generics integrate with other XXML features.
      </p>
    </>
  );
}
