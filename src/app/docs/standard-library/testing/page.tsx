import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Testing",
  description: "Unit testing framework in XXML",
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

export default function TestingPage() {
  return (
    <>
      <h1>Testing</h1>
      <p className="lead">
        The XXML Test Framework provides reflection-based test discovery and execution
        with assertion utilities. Use the <code>@Test</code> annotation and method naming
        conventions to define tests.
      </p>

      <CodeBlock language="xxml">{`#import Language::Core;
#import Language::Test;`}</CodeBlock>

      <h2>Quick Start</h2>
      <CodeBlock language="xxml" showLineNumbers>{`#import Language::Core;
#import Language::Test;

// Mark class as a test suite
@Test
[ Class <MathTests> Final Extends None
    [ Public <>
        // Test methods start with "test"
        Method <testAddition> Returns None Parameters () Do {
            Instantiate Integer^ As <result> = Integer::Constructor(2).add(Integer::Constructor(2));
            Run Assert::equals(
                Integer::Constructor(4),
                result,
                String::Constructor("2+2 should equal 4")
            );
        }

        Method <testSubtraction> Returns None Parameters () Do {
            Instantiate Integer^ As <result> = Integer::Constructor(5).subtract(Integer::Constructor(3));
            Run Assert::equals(
                Integer::Constructor(2),
                result,
                String::Constructor("5-3 should equal 2")
            );
        }
    ]
]

[ Entrypoint {
    Instantiate TestRunner^ As <runner> = TestRunner::Constructor();
    Instantiate Integer^ As <exitCode> = runner.run(String::Constructor("MathTests"));
    Exit(exitCode.toInt64());
}]`}</CodeBlock>

      <h2>Test Discovery</h2>
      <p>
        The framework uses reflection to automatically discover test methods. Any method
        whose name starts with <code>test</code> is considered a test method.
      </p>

      <h3>@Test Annotation</h3>
      <p>Use the <code>@Test</code> annotation to mark classes as test suites:</p>
      <CodeBlock language="xxml">{`@Test
[ Class <MyTestSuite> Final Extends None
    [ Public <>
        Method <testFeatureA> Returns None Parameters () Do { ... }
        Method <testFeatureB> Returns None Parameters () Do { ... }
        Method <helperMethod> Returns None Parameters () Do { ... }  // Not a test
    ]
]`}</CodeBlock>

      <Callout type="info">
        Only methods starting with &quot;test&quot; are discovered and executed. Helper methods
        and setup/teardown methods use different naming conventions.
      </Callout>

      <ClassHeader name="Assert" description="Static assertion methods for verifying test conditions." />

      <h3>Assertion Methods</h3>
      <MethodTable
        methods={[
          { name: "isTrue", params: "condition: Bool&, message: String&", returns: "None", desc: "Assert condition is true" },
          { name: "isFalse", params: "condition: Bool&, message: String&", returns: "None", desc: "Assert condition is false" },
          { name: "equals", params: "expected: Integer&, actual: Integer&, message: String&", returns: "None", desc: "Assert integers are equal" },
          { name: "equalsString", params: "expected: String&, actual: String&, message: String&", returns: "None", desc: "Assert strings are equal" },
          { name: "notNull", params: "message: String&", returns: "None", desc: "Reserved for nullable types" },
          { name: "fail", params: "message: String&", returns: "None", desc: "Explicitly fail the test" },
        ]}
      />

      <CodeBlock language="xxml">{`// Boolean assertions
Run Assert::isTrue(result.greaterThan(Integer::Constructor(0)), String::Constructor("Result should be positive"));
Run Assert::isFalse(list.isEmpty(), String::Constructor("List should not be empty"));

// Equality assertions
Run Assert::equals(
    Integer::Constructor(42),
    calculator.compute(),
    String::Constructor("Computation result")
);

Run Assert::equalsString(
    String::Constructor("hello"),
    greeting.toLowerCase(),
    String::Constructor("Greeting should be lowercase")
);

// Explicit failure
If (someCondition) -> {
    Run Assert::fail(String::Constructor("This condition should not occur"));
}`}</CodeBlock>

      <ClassHeader name="TestResult" description="Represents the result of a single test execution." />

      <h3>Properties</h3>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">Property</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm"><code>testName</code></td>
              <td className="px-4 py-3 text-sm font-mono">String^</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Name of the test method</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm"><code>passed</code></td>
              <td className="px-4 py-3 text-sm font-mono">Bool^</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Whether the test passed</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm"><code>message</code></td>
              <td className="px-4 py-3 text-sm font-mono">String^</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Success/failure message</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm"><code>durationMs</code></td>
              <td className="px-4 py-3 text-sm font-mono">Integer^</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Execution time in milliseconds</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ClassHeader name="TestSummary" description="Aggregates results from multiple tests." />

      <h3>Properties</h3>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">Property</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm"><code>totalTests</code></td>
              <td className="px-4 py-3 text-sm font-mono">Integer^</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Total number of tests run</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm"><code>passedTests</code></td>
              <td className="px-4 py-3 text-sm font-mono">Integer^</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Number of passing tests</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm"><code>failedTests</code></td>
              <td className="px-4 py-3 text-sm font-mono">Integer^</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Number of failing tests</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm"><code>results</code></td>
              <td className="px-4 py-3 text-sm font-mono">List&lt;TestResult&gt;^</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Individual test results</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Methods</h3>
      <MethodTable
        methods={[
          { name: "addResult", params: "result: TestResult^", returns: "None", desc: "Add a test result" },
          { name: "allPassed", params: "", returns: "Bool^", desc: "Check if all tests passed" },
          { name: "printSummary", params: "", returns: "None", desc: "Print formatted summary" },
        ]}
      />

      <h3>Sample Output</h3>
      <CodeBlock language="text">{`=== Test Summary ===
Total:  5
Passed: 4
Failed: 1

Failed tests:
  - testDivision: expected 3 but got 2

Some tests failed.`}</CodeBlock>

      <ClassHeader name="TestRunner" description="The main test execution engine." />

      <h3>Methods</h3>
      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "TestRunner^", desc: "Create test runner" },
          { name: "runTestClass", params: "typeName: String^", returns: "TestSummary^", desc: "Run all tests in a class" },
          { name: "run", params: "typeName: String^", returns: "Integer^", desc: "Run tests and return exit code" },
          { name: "fail", params: "message: String^", returns: "None", desc: "Mark current test as failed" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate TestRunner^ As <runner> = TestRunner::Constructor();

// Option 1: Get detailed summary
Instantiate TestSummary^ As <summary> = runner.runTestClass(String::Constructor("MyTests"));
Run summary.printSummary();

// Option 2: Run and get exit code directly
Instantiate Integer^ As <exitCode> = runner.run(String::Constructor("MyTests"));
// exitCode is 0 if all passed, 1 if any failed`}</CodeBlock>

      <h2>Test Method Conventions</h2>
      <ul>
        <li><strong>Naming</strong>: Methods must start with <code>test</code> to be discovered</li>
        <li><strong>Return Type</strong>: Should return <code>None</code></li>
        <li><strong>Parameters</strong>: Should take no parameters</li>
        <li><strong>Independence</strong>: Each test should be independent of others</li>
      </ul>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="list_tests.xxml" showLineNumbers>{`#import Language::Core;
#import Language::Collections;
#import Language::Test;

@Test
[ Class <ListTests> Final Extends None
    [ Public <>
        Method <testEmptyList> Returns None Parameters () Do {
            Instantiate List<Integer>^ As <list> = List<Integer>::Constructor();
            Run Assert::equals(
                Integer::Constructor(0),
                list.size(),
                String::Constructor("New list should be empty")
            );
        }

        Method <testAddElement> Returns None Parameters () Do {
            Instantiate List<Integer>^ As <list> = List<Integer>::Constructor();
            Run list.add(Integer::Constructor(42));

            Run Assert::equals(
                Integer::Constructor(1),
                list.size(),
                String::Constructor("List should have one element")
            );

            Run Assert::equals(
                Integer::Constructor(42),
                list.get(Integer::Constructor(0)),
                String::Constructor("Element should be 42")
            );
        }

        Method <testClear> Returns None Parameters () Do {
            Instantiate List<Integer>^ As <list> = List<Integer>::Constructor();
            Run list.add(Integer::Constructor(1));
            Run list.add(Integer::Constructor(2));
            Run list.clear();

            Run Assert::equals(
                Integer::Constructor(0),
                list.size(),
                String::Constructor("Cleared list should be empty")
            );
        }
    ]
]

[ Entrypoint {
    Instantiate TestRunner^ As <runner> = TestRunner::Constructor();
    Instantiate Integer^ As <exitCode> = runner.run(String::Constructor("ListTests"));
    Exit(exitCode.toInt64());
}]`}</CodeBlock>

      <h2>Running Tests</h2>
      <CodeBlock language="bash">{`# Compile test file
xxml MyTests.XXML -o mytests.exe

# Run tests
./mytests.exe

# Check exit code (0 = all passed, 1 = failures)
echo $?`}</CodeBlock>

      <h2>See Also</h2>
      <div className="not-prose mt-4 flex flex-wrap gap-2">
        <a href="/docs/advanced/reflection" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Reflection
        </a>
        <a href="/docs/advanced/annotations" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Annotations
        </a>
        <a href="/docs/standard-library/collections" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Collections
        </a>
      </div>
    </>
  );
}
