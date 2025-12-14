import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Ownership",
  description: "XXML ownership semantics and memory management",
};

export default function OwnershipPage() {
  return (
    <>
      <h1>Ownership</h1>
      <p className="lead">
        XXML uses explicit ownership semantics to ensure memory safety without
        garbage collection. Every value has exactly one owner at any time.
      </p>

      <h2>Ownership Modifiers</h2>
      <p>XXML has three ownership modifiers that define how values are passed and stored:</p>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-xl font-bold text-white">
              ^
            </span>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Owned
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Transfer ownership
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-xl font-bold text-white">
              &amp;
            </span>
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                Reference
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Borrow without ownership
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-xl font-bold text-white">
              %
            </span>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                Copy
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Create independent copy
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2>
        Owned Values <code>^</code>
      </h2>
      <p>
        The caret (<code>^</code>) indicates ownership. When a value is owned, the
        variable is responsible for its memory and the value is destroyed when
        the owner goes out of scope.
      </p>

      <CodeBlock language="xxml" filename="owned.xxml">{`// Create an owned string
Instantiate String^ As <name> = String::Constructor("Alice");

// Ownership is transferred to 'other'
Instantiate String^ As <other> = name;

// ERROR: 'name' is no longer valid - ownership was moved
// Run Console::printLine(name);  // Compile error!

// 'other' now owns the string
Run Console::printLine(other);`}</CodeBlock>

      <Callout type="info">
        When ownership is transferred (moved), the original variable becomes
        invalid. This prevents use-after-move bugs at compile time.
      </Callout>

      <h2>
        References <code>&amp;</code>
      </h2>
      <p>
        The ampersand (<code>&amp;</code>) creates a borrowed reference. References
        allow access to data without taking ownership.
      </p>

      <CodeBlock language="xxml" filename="reference.xxml">{`// Create an owned string
Instantiate String^ As <name> = String::Constructor("Alice");

// Borrow a reference - 'name' still owns the data
Instantiate String& As <nameRef> = &name;

// Both are valid
Run Console::printLine(name);      // Original still valid
Run Console::printLine(nameRef);   // Reference also works`}</CodeBlock>

      <h3>Reference Parameters</h3>
      <p>Functions commonly use references to avoid unnecessary copies:</p>

      <CodeBlock language="xxml">{`Method <printPerson> Returns None Parameters (
    Parameter <name> Types String&,
    Parameter <age> Types Integer&
) Do
{
    Run Console::printLine(name);
    Run Console::printLine(age.toString());
}

// Caller retains ownership
Instantiate String^ As <myName> = String::Constructor("Bob");
Instantiate Integer^ As <myAge> = Integer::Constructor(30);

Run printPerson(&myName, &myAge);

// Variables still valid after the call
Run Console::printLine(myName);`}</CodeBlock>

      <Callout type="tip">
        Use references (<code>&amp;</code>) for read-only access to large data structures.
        This avoids expensive copies while keeping the caller&apos;s ownership intact.
      </Callout>

      <h2>
        Copies <code>%</code>
      </h2>
      <p>
        The percent sign (<code>%</code>) creates a copy. The new value is completely
        independent of the original.
      </p>

      <CodeBlock language="xxml" filename="copy.xxml">{`Instantiate Integer^ As <original> = Integer::Constructor(42);

// Create a copy - 'copy' gets its own value
Instantiate Integer^ As <copy> = %original;

// Modifying copy doesn't affect original
Set copy = copy.add(Integer::Constructor(1));

Run Console::printLine(original.toString());  // 42
Run Console::printLine(copy.toString());      // 43`}</CodeBlock>

      <h3>Copy Parameters</h3>
      <p>
        Copy parameters are useful when a function needs to modify a value without
        affecting the caller:
      </p>

      <CodeBlock language="xxml">{`Method <processValue> Returns Integer^ Parameters (
    Parameter <value> Types Integer%  // Receives a copy
) Do
{
    // Can freely modify the copy
    Set value = value.multiply(Integer::Constructor(2));
    Return value;
}

Instantiate Integer^ As <x> = Integer::Constructor(10);
Instantiate Integer^ As <result> = processValue(x);

Run Console::printLine(x.toString());      // 10 (unchanged)
Run Console::printLine(result.toString()); // 20`}</CodeBlock>

      <h2>Ownership in Classes</h2>
      <p>Class properties declare their ownership mode:</p>

      <CodeBlock language="xxml" filename="person.xxml">{`[ Class <Person> Final Extends None
    [ Private <>
        Property <name> Types String^;    // Owned
        Property <age> Types Integer^;    // Owned
    ]

    [ Public <>
        Constructor Parameters (
            Parameter <n> Types String^,   // Takes ownership
            Parameter <a> Types Integer%   // Receives copy
        ) ->
        {
            Set name = n;
            Set age = a;
        }

        // Returns reference - caller doesn't take ownership
        Method <getName> Returns String& Parameters () Do
        {
            Return &name;
        }

        // Returns copy - caller gets independent value
        Method <getAge> Returns Integer^ Parameters () Do
        {
            Return %age;
        }
    ]
]`}</CodeBlock>

      <h2>Lambda Captures</h2>
      <p>Lambdas can capture variables with different ownership semantics:</p>

      <CodeBlock language="xxml">{`// Copy capture - lambda gets its own copy
Instantiate Integer^ As <multiplier> = Integer::Constructor(5);
Instantiate F(Integer^)(Integer&)^ As <multiply> = [ Lambda [%multiplier] Returns Integer^ Parameters (
    Parameter <n> Types Integer&
) {
    Return n.multiply(multiplier);
}];
// multiplier still valid here

// Owned capture - moves value into lambda
Instantiate String^ As <data> = String::Constructor("secret");
Instantiate F(String^)()^ As <getData> = [ Lambda [^data] Returns String^ Parameters () {
    Return data;
}];
// data is no longer valid - ownership moved to lambda

// Reference capture - borrows from outer scope
Instantiate Integer^ As <counter> = Integer::Constructor(0);
Instantiate F(Integer^)()^ As <getCount> = [ Lambda [&counter] Returns Integer^ Parameters () {
    Return counter;
}];
// counter still owned here, lambda borrows it`}</CodeBlock>

      <h2>Ownership Rules Summary</h2>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Modifier
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Semantics
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Use When
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3">
                <code className="rounded bg-blue-100 px-2 py-1 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  ^
                </code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                Transfer ownership (move)
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Storing data, factory methods, taking ownership
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">
                <code className="rounded bg-purple-100 px-2 py-1 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  &amp;
                </code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                Borrow reference (no ownership)
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Read-only access, avoiding copies
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">
                <code className="rounded bg-green-100 px-2 py-1 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  %
                </code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                Create independent copy
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Small values, need to modify locally
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="warning">
        Ownership errors are caught at compile time. The compiler ensures that
        you never use a moved value or have dangling references.
      </Callout>

      <h2>Next Steps</h2>
      <p>
        Learn how ownership works with{" "}
        <a href="/docs/language-reference/generics">generic types</a> or see{" "}
        <a href="/docs/examples/ownership-patterns">common ownership patterns</a>{" "}
        in practice.
      </p>
    </>
  );
}
