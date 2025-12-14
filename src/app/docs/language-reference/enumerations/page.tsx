import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Enumerations",
  description: "Named integer constants in XXML",
};

export default function EnumerationsPage() {
  return (
    <>
      <h1>Enumerations</h1>
      <p className="lead">
        Enumerations define named integer constants for type-safe value sets,
        providing readable and maintainable code.
      </p>

      <h2>Declaration Syntax</h2>
      <CodeBlock language="xxml">{`[ Enumeration <EnumName>
    Value <NAME1> = intValue;
    Value <NAME2> = intValue;
    Value <NAME3>;  // Auto-increments from previous value
]`}</CodeBlock>

      <h2>Explicit Values</h2>
      <p>Each enum value can have an explicit integer assignment:</p>
      <CodeBlock language="xxml">{`[ Enumeration <Color>
    Value <RED> = 1;
    Value <GREEN> = 2;
    Value <BLUE> = 3;
]`}</CodeBlock>

      <h2>Auto-Increment</h2>
      <p>
        When no value is specified, the compiler auto-increments from the
        previous value:
      </p>
      <CodeBlock language="xxml">{`[ Enumeration <Key>
    Value <UNKNOWN> = -1;
    Value <SPACE> = 32;
    Value <A> = 65;
    Value <B>;  // Auto: 66
    Value <C>;  // Auto: 67
    Value <D>;  // Auto: 68
]`}</CodeBlock>

      <Callout type="info">
        If no previous value exists, auto-increment starts from 0.
      </Callout>

      <h2>Accessing Enum Values</h2>
      <p>
        Enum values are accessed using the <code>EnumName::ValueName</code>{" "}
        syntax:
      </p>
      <CodeBlock language="xxml">{`// Use enum value in comparison
If (keyCode.equals(Integer::Constructor(Key::SPACE))) -> {
    Run Console::printLine(String::Constructor("Space pressed"));
}

// Use as constructor argument
Instantiate Integer^ As <color> = Integer::Constructor(Color::RED);`}</CodeBlock>

      <h2>Features</h2>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Feature
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Explicit values
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Assign any integer value with <code>= intValue</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Auto-increment
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Continues from previous value when omitted
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Namespace-qualified
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Access via <code>EnumName::Value</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Compile-time constants
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Values resolved at compile time
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="enums.xxml">{`#import Language::Core;
#import Language::System;

[ Enumeration <Direction>
    Value <NORTH> = 0;
    Value <EAST> = 1;
    Value <SOUTH> = 2;
    Value <WEST> = 3;
]

[ Enumeration <HttpStatus>
    Value <OK> = 200;
    Value <CREATED> = 201;
    Value <BAD_REQUEST> = 400;
    Value <NOT_FOUND> = 404;
    Value <INTERNAL_ERROR> = 500;
]

[ Entrypoint
    {
        // Use enum values
        Instantiate Integer^ As <currentDirection> = Integer::Constructor(Direction::NORTH);

        Run Console::printLine(
            String::Constructor("Direction value: ").append(currentDirection.toString())
        );

        // Compare with enum
        If (currentDirection.equals(Integer::Constructor(Direction::NORTH))) -> {
            Run Console::printLine(String::Constructor("Facing North"));
        }

        // HTTP status example
        Instantiate Integer^ As <status> = Integer::Constructor(HttpStatus::OK);

        If (status.equals(Integer::Constructor(HttpStatus::OK))) -> {
            Run Console::printLine(String::Constructor("Request successful"));
        }

        Exit(0);
    }
]`}</CodeBlock>

      <h2>Use Cases</h2>

      <h3>State Machines</h3>
      <CodeBlock language="xxml">{`[ Enumeration <GameState>
    Value <MENU> = 0;
    Value <PLAYING> = 1;
    Value <PAUSED> = 2;
    Value <GAME_OVER> = 3;
]

// Check current state
If (state.equals(Integer::Constructor(GameState::PLAYING))) -> {
    Run updateGame();
}`}</CodeBlock>

      <h3>Configuration Options</h3>
      <CodeBlock language="xxml">{`[ Enumeration <LogLevel>
    Value <DEBUG> = 0;
    Value <INFO> = 1;
    Value <WARNING> = 2;
    Value <ERROR> = 3;
]`}</CodeBlock>

      <h3>Bit Flags</h3>
      <CodeBlock language="xxml">{`[ Enumeration <Permission>
    Value <NONE> = 0;
    Value <READ> = 1;
    Value <WRITE> = 2;
    Value <EXECUTE> = 4;
    Value <ALL> = 7;  // READ | WRITE | EXECUTE
]`}</CodeBlock>

      <Callout type="tip">
        Use power-of-two values for bit flags to allow combining permissions
        with bitwise operations.
      </Callout>

      <h2>Limitations</h2>
      <ul>
        <li>Enum values are compile-time integer constants</li>
        <li>No methods or associated data on enum types</li>
        <li>Cannot iterate over enum values</li>
        <li>No type safety beyond integer comparison</li>
      </ul>

      <h2>Next Steps</h2>
      <p>
        Learn about <a href="/docs/language-reference/classes">Classes</a> for
        more complex type definitions, or explore{" "}
        <a href="/docs/language-reference/syntax">Syntax</a> for a complete
        language reference.
      </p>
    </>
  );
}
