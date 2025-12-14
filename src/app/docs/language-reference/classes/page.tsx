import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Classes",
  description: "XXML class definitions and object-oriented programming",
};

export default function ClassesPage() {
  return (
    <>
      <h1>Classes</h1>
      <p className="lead">
        XXML supports object-oriented programming with classes, constructors,
        methods, and inheritance.
      </p>

      <h2>Class Declaration</h2>
      <p>Classes are declared using square brackets with visibility sections:</p>

      <CodeBlock language="xxml">{`[ Class <ClassName> Final Extends BaseClass
    [ Public <>
        // Public members
    ]
    [ Private <>
        // Private members
    ]
    [ Protected <>
        // Protected members
    ]
]`}</CodeBlock>

      <Callout type="info">
        The <code>Final</code> keyword indicates the class cannot be extended.
        Use <code>Extends None</code> for classes with no base class.
      </Callout>

      <h2>Properties</h2>
      <p>
        Properties are declared with their type and ownership modifier inside
        visibility sections:
      </p>

      <CodeBlock language="xxml" filename="person.xxml">{`[ Class <Person> Final Extends None
    [ Private <>
        Property <name> Types String^;
        Property <age> Types Integer^;
    ]

    [ Public <>
        Property <isActive> Types Bool^;
    ]
]`}</CodeBlock>

      <h2>Constructors</h2>

      <h3>Default Constructor</h3>
      <p>Use <code>= default</code> for a simple default constructor:</p>

      <CodeBlock language="xxml">{`[ Class <Widget> Final Extends None
    [ Public <>
        Constructor = default;
    ]
]`}</CodeBlock>

      <h3>Custom Constructor</h3>
      <p>
        Custom constructors take parameters and initialize properties using the
        arrow syntax:
      </p>

      <CodeBlock language="xxml">{`[ Class <Person> Final Extends None
    [ Private <>
        Property <name> Types String^;
        Property <age> Types Integer^;
    ]

    [ Public <>
        Constructor Parameters (
            Parameter <n> Types String^,
            Parameter <a> Types Integer^
        ) ->
        {
            Set name = n;
            Set age = a;
        }
    ]
]

// Creating an instance
Instantiate Person^ As <person> = Person::Constructor(
    String::Constructor("Alice"),
    Integer::Constructor(30)
);`}</CodeBlock>

      <h2>Methods</h2>

      <h3>Instance Methods</h3>
      <p>
        Methods are declared with <code>Method</code>, return type, parameters,
        and <code>Do</code>:
      </p>

      <CodeBlock language="xxml">{`[ Class <Calculator> Final Extends None
    [ Public <>
        Constructor = default;

        Method <add> Returns Integer^ Parameters (
            Parameter <a> Types Integer%,
            Parameter <b> Types Integer%
        ) Do
        {
            Return a.add(b);
        }

        Method <greet> Returns None Parameters () Do
        {
            Run Console::printLine(String::Constructor("Hello from Calculator!"));
        }
    ]
]

// Calling methods
Instantiate Calculator^ As <calc> = Calculator::Constructor();
Instantiate Integer^ As <sum> = calc.add(Integer::Constructor(5), Integer::Constructor(3));
Run calc.greet();`}</CodeBlock>

      <h3>Method Return Types</h3>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Return Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Use Case
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Example
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3">
                <code>Type^</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                Returns new owned value
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Factory methods, creating new data
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">
                <code>Type&amp;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                Returns reference to internal data
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Getters, accessing properties
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">
                <code>None</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                No return value
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Side-effect methods (print, modify)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <CodeBlock language="xxml">{`// Returns owned value (creates new data)
Method <createMessage> Returns String^ Parameters () Do
{
    Return String::Constructor("New message");
}

// Returns reference (borrows internal data)
Method <getName> Returns String& Parameters () Do
{
    Return &name;
}

// Returns nothing (performs action)
Method <printInfo> Returns None Parameters () Do
{
    Run Console::printLine(name);
}`}</CodeBlock>

      <h2>Access Modifiers</h2>

      <div className="not-prose my-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Public
          </h4>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
            Accessible from anywhere
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Protected
          </h4>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
            Accessible by class and subclasses
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Private
          </h4>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
            Only accessible within the class
          </p>
        </div>
      </div>

      <CodeBlock language="xxml">{`[ Class <Account> Final Extends None
    [ Private <>
        // Only accessible within this class
        Property <balance> Types Integer^;
    ]

    [ Protected <>
        // Accessible by this class and subclasses
        Property <accountId> Types String^;
    ]

    [ Public <>
        // Accessible from anywhere
        Method <getBalance> Returns Integer& Parameters () Do
        {
            Return &balance;
        }
    ]
]`}</CodeBlock>

      <h2>Inheritance</h2>
      <p>
        Classes can extend other classes using <code>Extends</code>:
      </p>

      <CodeBlock language="xxml">{`[ Class <Animal> Final Extends None
    [ Protected <>
        Property <name> Types String^;
    ]

    [ Public <>
        Constructor Parameters (Parameter <n> Types String^) ->
        {
            Set name = n;
        }

        Method <speak> Returns None Parameters () Do
        {
            Run Console::printLine(String::Constructor("..."));
        }
    ]
]

[ Class <Dog> Final Extends Animal
    [ Public <>
        Constructor Parameters (Parameter <n> Types String^) ->
        {
            Set name = n;
        }

        Method <speak> Returns None Parameters () Do
        {
            Run Console::printLine(String::Constructor("Woof!"));
        }
    ]
]`}</CodeBlock>

      <Callout type="tip">
        Subclasses can override methods from the parent class. Protected members
        are accessible in subclasses.
      </Callout>

      <h2>Enumerations</h2>
      <p>Define a set of named constants:</p>

      <CodeBlock language="xxml">{`[ Enumeration <Status>
    Value <PENDING> = 0;
    Value <ACTIVE> = 1;
    Value <COMPLETED> = 2;
    Value <CANCELLED> = 3;
]

// Usage
Instantiate Status^ As <currentStatus> = Status::ACTIVE;

If (currentStatus.equals(Status::COMPLETED)) -> {
    Run Console::printLine(String::Constructor("Task is done"));
}`}</CodeBlock>

      <h2>Complete Example</h2>

      <CodeBlock language="xxml" filename="bank_account.xxml" showLineNumbers>{`#import Language::Core;

[ Class <BankAccount> Final Extends None
    [ Private <>
        Property <owner> Types String^;
        Property <balance> Types Integer^;
    ]

    [ Public <>
        Constructor Parameters (
            Parameter <ownerName> Types String^,
            Parameter <initialBalance> Types Integer^
        ) ->
        {
            Set owner = ownerName;
            Set balance = initialBalance;
        }

        Method <deposit> Returns None Parameters (Parameter <amount> Types Integer%) Do
        {
            Set balance = balance.add(amount);
        }

        Method <withdraw> Returns Bool^ Parameters (Parameter <amount> Types Integer%) Do
        {
            If (balance.greaterThanOrEqual(amount)) -> {
                Set balance = balance.subtract(amount);
                Return Bool::Constructor(true);
            } Else -> {
                Return Bool::Constructor(false);
            }
        }

        Method <getBalance> Returns Integer& Parameters () Do
        {
            Return &balance;
        }

        Method <printStatement> Returns None Parameters () Do
        {
            Run Console::printLine(String::Constructor("Account: ").concat(owner));
            Run Console::printLine(String::Constructor("Balance: ").concat(balance.toString()));
        }
    ]
]

[ Entrypoint
    {
        Instantiate BankAccount^ As <account> = BankAccount::Constructor(
            String::Constructor("Alice"),
            Integer::Constructor(1000)
        );

        Run account.deposit(Integer::Constructor(500));
        Run account.withdraw(Integer::Constructor(200));
        Run account.printStatement();

        Exit(0);
    }
]`}</CodeBlock>

      <h2>Best Practices</h2>
      <ul>
        <li>
          <strong>Keep properties private</strong> and expose them through
          methods
        </li>
        <li>
          <strong>Use <code>^</code> owned returns</strong> for factory methods
          creating new data
        </li>
        <li>
          <strong>Use <code>&amp;</code> reference returns</strong> for getters
          to avoid copies
        </li>
        <li>
          <strong>Accept <code>%</code> copy parameters</strong> for small
          values like integers
        </li>
        <li>
          <strong>Accept <code>&amp;</code> reference parameters</strong> for
          large read-only data
        </li>
      </ul>

      <h2>Next Steps</h2>
      <p>
        Learn about <a href="/docs/language-reference/generics">generics</a> to
        create reusable class templates, or explore{" "}
        <a href="/docs/language-reference/lambdas">lambdas</a> for functional
        programming.
      </p>
    </>
  );
}
