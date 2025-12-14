import Link from "next/link";

export const metadata = {
  title: "Examples",
  description: "XXML code examples and tutorials",
};

export default function ExamplesPage() {
  return (
    <>
      <h1>Examples</h1>
      <p className="lead">
        Learn XXML through practical examples, from basic programs to advanced
        patterns.
      </p>

      <div className="not-prose mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/docs/examples/basic-programs"
          className="group rounded-lg border border-zinc-200 p-4 transition-all hover:border-blue-500 hover:shadow-md dark:border-zinc-800"
        >
          <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100">
            Basic Programs
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
            Hello World, variables, loops, and control flow
          </p>
        </Link>

        <Link
          href="/docs/examples/ownership-patterns"
          className="group rounded-lg border border-zinc-200 p-4 transition-all hover:border-blue-500 hover:shadow-md dark:border-zinc-800"
        >
          <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100">
            Ownership Patterns
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
            Common patterns for working with ownership semantics
          </p>
        </Link>
      </div>

      <h2 className="mt-12">Quick Examples</h2>

      <h3>Hello World</h3>
      <pre>
        <code>{`#import Language::Core;

[ Entrypoint
    {
        Run Console::printLine(String::Constructor("Hello, World!"));
        Exit(0);
    }
]`}</code>
      </pre>

      <h3>Variables and Arithmetic</h3>
      <pre>
        <code>{`#import Language::Core;

[ Entrypoint
    {
        Instantiate Integer^ As <a> = Integer::Constructor(10);
        Instantiate Integer^ As <b> = Integer::Constructor(20);
        Instantiate Integer^ As <sum> = a.add(b);

        Run Console::printLine(String::Constructor("Sum: ").concat(sum.toString()));
        Exit(0);
    }
]`}</code>
      </pre>

      <h3>Loops</h3>
      <pre>
        <code>{`#import Language::Core;

[ Entrypoint
    {
        // For loop
        For (Integer^ <i> = 1 .. 6) ->
        {
            Run Console::printLine(i.toString());
        }

        // While loop
        Instantiate Integer^ As <count> = Integer::Constructor(0);
        While (count.lessThan(Integer::Constructor(5))) ->
        {
            Run Console::printLine(String::Constructor("Count: ").concat(count.toString()));
            Set count = count.add(Integer::Constructor(1));
        }

        Exit(0);
    }
]`}</code>
      </pre>

      <h3>Simple Class</h3>
      <pre>
        <code>{`#import Language::Core;

[ Class <Greeter> Final Extends None
    [ Private <>
        Property <name> Types String^;
    ]

    [ Public <>
        Constructor Parameters (Parameter <n> Types String^) ->
        {
            Set name = n;
        }

        Method <greet> Returns None Parameters () Do
        {
            Run Console::printLine(String::Constructor("Hello, ").concat(name).concat(String::Constructor("!")));
        }
    ]
]

[ Entrypoint
    {
        Instantiate Greeter^ As <g> = Greeter::Constructor(String::Constructor("World"));
        Run g.greet();
        Exit(0);
    }
]`}</code>
      </pre>

      <h3>Generic Container</h3>
      <pre>
        <code>{`#import Language::Core;
#import Language::Collections;

[ Class <Stack> <T Constrains None> Final Extends None
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
            Return items.removeLast();
        }

        Method <isEmpty> Returns Bool^ Parameters () Do
        {
            Return items.size().equals(Integer::Constructor(0));
        }
    ]
]

[ Entrypoint
    {
        Instantiate Stack<Integer>^ As <stack> = Stack@Integer::Constructor();

        Run stack.push(Integer::Constructor(1));
        Run stack.push(Integer::Constructor(2));
        Run stack.push(Integer::Constructor(3));

        While (stack.isEmpty().not()) ->
        {
            Instantiate Integer^ As <val> = stack.pop();
            Run Console::printLine(val.toString());
        }

        Exit(0);
    }
]`}</code>
      </pre>
    </>
  );
}
