import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Basic Programs",
  description: "Basic XXML program examples",
};

export default function BasicProgramsPage() {
  return (
    <>
      <h1>Basic Programs</h1>
      <p className="lead">
        Get started with XXML through these fundamental examples covering
        basic syntax, variables, control flow, and functions.
      </p>

      <h2>Hello World</h2>
      <p>The simplest XXML program:</p>

      <CodeBlock language="xxml" filename="hello.xxml">{`#import Language::Core;

[ Entrypoint
    {
        Run Console::printLine(String::Constructor("Hello, World!"));
        Exit(0);
    }
]`}</CodeBlock>

      <Callout type="info">
        Every XXML program needs an <code>Entrypoint</code> block as its entry point.
        The <code>Exit(0)</code> call terminates the program with a success status code.
      </Callout>

      <h2>Variables</h2>
      <p>Working with different types:</p>

      <CodeBlock language="xxml" filename="variables.xxml" showLineNumbers>{`#import Language::Core;

[ Entrypoint
    {
        // Integer
        Instantiate Integer^ As <age> = Integer::Constructor(25);

        // String
        Instantiate String^ As <name> = String::Constructor("Alice");

        // Boolean
        Instantiate Bool^ As <active> = Bool::Constructor(true);

        // Print values
        Run Console::printLine(String::Constructor("Name: ").concat(name));
        Run Console::printLine(String::Constructor("Age: ").concat(age.toString()));

        If (active) -> {
            Run Console::printLine(String::Constructor("Status: Active"));
        }

        Exit(0);
    }
]`}</CodeBlock>

      <h2>User Input</h2>
      <p>Reading input from the console:</p>

      <CodeBlock language="xxml" filename="input.xxml">{`#import Language::Core;

[ Entrypoint
    {
        Run Console::printLine(String::Constructor("What is your name?"));
        Instantiate String^ As <name> = Console::readLine();

        Run Console::printLine(String::Constructor("Hello, ").concat(name).concat(String::Constructor("!")));

        Exit(0);
    }
]`}</CodeBlock>

      <h2>Arithmetic Operations</h2>
      <p>XXML uses method calls for arithmetic operations:</p>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Operation
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Method
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Example
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">Addition</td>
              <td className="px-4 py-3"><code>a.add(b)</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">15 + 4 = 19</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Subtraction</td>
              <td className="px-4 py-3"><code>a.subtract(b)</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">15 - 4 = 11</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Multiplication</td>
              <td className="px-4 py-3"><code>a.multiply(b)</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">15 * 4 = 60</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Division</td>
              <td className="px-4 py-3"><code>a.divide(b)</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">15 / 4 = 3</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Modulo</td>
              <td className="px-4 py-3"><code>a.modulo(b)</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">15 % 4 = 3</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CodeBlock language="xxml" filename="arithmetic.xxml" showLineNumbers>{`#import Language::Core;

[ Entrypoint
    {
        Instantiate Integer^ As <a> = Integer::Constructor(15);
        Instantiate Integer^ As <b> = Integer::Constructor(4);

        Instantiate Integer^ As <sum> = a.add(b);
        Instantiate Integer^ As <diff> = a.subtract(b);
        Instantiate Integer^ As <product> = a.multiply(b);
        Instantiate Integer^ As <quotient> = a.divide(b);
        Instantiate Integer^ As <remainder> = a.modulo(b);

        Run Console::printLine(String::Constructor("a = ").concat(a.toString()));
        Run Console::printLine(String::Constructor("b = ").concat(b.toString()));
        Run Console::printLine(String::Constructor("a + b = ").concat(sum.toString()));
        Run Console::printLine(String::Constructor("a - b = ").concat(diff.toString()));
        Run Console::printLine(String::Constructor("a * b = ").concat(product.toString()));
        Run Console::printLine(String::Constructor("a / b = ").concat(quotient.toString()));
        Run Console::printLine(String::Constructor("a % b = ").concat(remainder.toString()));

        Exit(0);
    }
]`}</CodeBlock>

      <h2>Conditionals</h2>
      <p>Use <code>If</code> / <code>Else</code> for conditional branching:</p>

      <CodeBlock language="xxml" filename="conditionals.xxml" showLineNumbers>{`#import Language::Core;

[ Entrypoint
    {
        Instantiate Integer^ As <score> = Integer::Constructor(85);

        If (score.greaterThanOrEqual(Integer::Constructor(90))) -> {
            Run Console::printLine(String::Constructor("Grade: A"));
        } Else -> {
            If (score.greaterThanOrEqual(Integer::Constructor(80))) -> {
                Run Console::printLine(String::Constructor("Grade: B"));
            } Else -> {
                If (score.greaterThanOrEqual(Integer::Constructor(70))) -> {
                    Run Console::printLine(String::Constructor("Grade: C"));
                } Else -> {
                    Run Console::printLine(String::Constructor("Grade: F"));
                }
            }
        }

        Exit(0);
    }
]`}</CodeBlock>

      <Callout type="tip">
        Comparison methods include <code>equals()</code>, <code>greaterThan()</code>,
        <code>lessThan()</code>, <code>greaterThanOrEqual()</code>, and <code>lessThanOrEqual()</code>.
      </Callout>

      <h2>For Loops</h2>
      <p>The <code>For</code> loop iterates over a range:</p>

      <CodeBlock language="xxml" filename="for_loop.xxml" showLineNumbers>{`#import Language::Core;

[ Entrypoint
    {
        // Count from 1 to 10
        Run Console::printLine(String::Constructor("Counting:"));
        For (Integer^ <i> = 1 .. 11) ->
        {
            Run Console::printLine(i.toString());
        }

        // Calculate sum
        Instantiate Integer^ As <sum> = Integer::Constructor(0);
        For (Integer^ <i> = 1 .. 101) ->
        {
            Set sum = sum.add(i);
        }
        Run Console::printLine(String::Constructor("Sum 1-100: ").concat(sum.toString()));

        Exit(0);
    }
]`}</CodeBlock>

      <Callout type="warning">
        The range <code>1 .. 11</code> is exclusive of the end value, so it iterates from 1 to 10.
        To include 10, use <code>1 .. 11</code>.
      </Callout>

      <h2>While Loops</h2>
      <p>The <code>While</code> loop continues while a condition is true:</p>

      <CodeBlock language="xxml" filename="while_loop.xxml" showLineNumbers>{`#import Language::Core;

[ Entrypoint
    {
        // Countdown
        Instantiate Integer^ As <count> = Integer::Constructor(10);

        While (count.greaterThan(Integer::Constructor(0))) ->
        {
            Run Console::printLine(count.toString());
            Set count = count.subtract(Integer::Constructor(1));
        }

        Run Console::printLine(String::Constructor("Liftoff!"));

        Exit(0);
    }
]`}</CodeBlock>

      <h2>FizzBuzz</h2>
      <p>The classic programming challenge:</p>

      <CodeBlock language="xxml" filename="fizzbuzz.xxml" showLineNumbers>{`#import Language::Core;

[ Entrypoint
    {
        For (Integer^ <i> = 1 .. 101) ->
        {
            Instantiate Bool^ As <divBy3> = i.modulo(Integer::Constructor(3)).equals(Integer::Constructor(0));
            Instantiate Bool^ As <divBy5> = i.modulo(Integer::Constructor(5)).equals(Integer::Constructor(0));

            If (divBy3.and(divBy5)) -> {
                Run Console::printLine(String::Constructor("FizzBuzz"));
            } Else -> {
                If (divBy3) -> {
                    Run Console::printLine(String::Constructor("Fizz"));
                } Else -> {
                    If (divBy5) -> {
                        Run Console::printLine(String::Constructor("Buzz"));
                    } Else -> {
                        Run Console::printLine(i.toString());
                    }
                }
            }
        }

        Exit(0);
    }
]`}</CodeBlock>

      <h2>Factorial</h2>
      <p>Demonstrates defining a class with a method:</p>

      <CodeBlock language="xxml" filename="factorial.xxml" showLineNumbers>{`#import Language::Core;

[ Class <MathUtils> Final Extends None
    [ Public <>
        Constructor = default;

        Method <factorial> Returns Integer^ Parameters (Parameter <n> Types Integer%) Do
        {
            Instantiate Integer^ As <result> = Integer::Constructor(1);

            For (Integer^ <i> = 2 .. n.add(Integer::Constructor(1))) ->
            {
                Set result = result.multiply(i);
            }

            Return result;
        }
    ]
]

[ Entrypoint
    {
        Instantiate MathUtils^ As <math> = MathUtils::Constructor();

        For (Integer^ <n> = 0 .. 11) ->
        {
            Instantiate Integer^ As <fact> = math.factorial(n);
            Run Console::printLine(
                n.toString().concat(String::Constructor("! = ")).concat(fact.toString())
            );
        }

        Exit(0);
    }
]`}</CodeBlock>

      <Callout type="info">
        The parameter <code>n</code> uses <code>Integer%</code> (copy) because we only need
        the value, not ownership of the original.
      </Callout>

      <h2>Working with Lists</h2>
      <p>Using the Collections module to work with lists:</p>

      <CodeBlock language="xxml" filename="lists.xxml" showLineNumbers>{`#import Language::Core;
#import Language::Collections;

[ Entrypoint
    {
        // Create a list of numbers
        Instantiate Collections::List<Integer>^ As <numbers> =
            Collections::List@Integer::Constructor();

        // Add numbers
        Run numbers.add(Integer::Constructor(5));
        Run numbers.add(Integer::Constructor(2));
        Run numbers.add(Integer::Constructor(8));
        Run numbers.add(Integer::Constructor(1));
        Run numbers.add(Integer::Constructor(9));

        // Find sum and max
        Instantiate Integer^ As <sum> = Integer::Constructor(0);
        Instantiate Integer^ As <max> = numbers.get(Integer::Constructor(0));

        For (Integer^ <i> = 0 .. numbers.size()) ->
        {
            Instantiate Integer& As <num> = numbers.get(i);
            Set sum = sum.add(num);

            If (num.greaterThan(max)) -> {
                Set max = num;
            }
        }

        Run Console::printLine(String::Constructor("Count: ").concat(numbers.size().toString()));
        Run Console::printLine(String::Constructor("Sum: ").concat(sum.toString()));
        Run Console::printLine(String::Constructor("Max: ").concat(max.toString()));

        Exit(0);
    }
]`}</CodeBlock>

      <h2>Quick Reference</h2>

      <div className="not-prose my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { keyword: "Instantiate", desc: "Create a new variable" },
          { keyword: "Set", desc: "Assign a value to a variable" },
          { keyword: "Run", desc: "Execute a method call" },
          { keyword: "If / Else", desc: "Conditional branching" },
          { keyword: "For", desc: "Range-based iteration" },
          { keyword: "While", desc: "Condition-based loop" },
          { keyword: "Return", desc: "Return a value from method" },
          { keyword: "Exit()", desc: "Terminate the program" },
          { keyword: "Class", desc: "Define a new class" },
        ].map((item) => (
          <div
            key={item.keyword}
            className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700"
          >
            <code className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{item.keyword}</code>
            <p className="mt-1 text-xs text-zinc-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <h2>Next Steps</h2>
      <p>
        Now that you understand the basics, explore{" "}
        <a href="/docs/examples/ownership-patterns">ownership patterns</a> to learn
        how to effectively use XXML&apos;s ownership system, or dive into the{" "}
        <a href="/docs/language-reference/syntax">language reference</a> for complete
        syntax documentation.
      </p>
    </>
  );
}
