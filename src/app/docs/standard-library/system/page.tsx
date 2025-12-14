import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "System Module",
  description: "XXML Language::System module reference",
};

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

export default function SystemPage() {
  return (
    <>
      <h1>System Module</h1>
      <p className="lead">
        The <code>Language::System</code> module provides console I/O, timing,
        environment access, and program control through the <code>Console</code> class.
      </p>

      <CodeBlock language="xxml">{`#import Language::System;`}</CodeBlock>

      <div className="not-prose mb-6 mt-8 rounded-lg border border-zinc-200 bg-gradient-to-r from-zinc-50 to-white p-4 dark:border-zinc-700 dark:from-zinc-800/50 dark:to-zinc-900">
        <h2 className="m-0 text-xl font-bold text-zinc-900 dark:text-zinc-100">Console</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
          Static class providing standard I/O, timing, and system operations.
        </p>
      </div>

      <h3>Output Operations</h3>
      <MethodTable
        methods={[
          { name: "print", params: "message: String^", returns: "None", desc: "Print without newline" },
          { name: "printLine", params: "message: String^", returns: "None", desc: "Print with newline" },
          { name: "printError", params: "message: String^", returns: "None", desc: "Print to stderr" },
          { name: "printFormatted", params: "format: String^, value: String^", returns: "None", desc: "Formatted output" },
          { name: "clear", params: "", returns: "None", desc: "Clear console screen" },
        ]}
      />

      <CodeBlock language="xxml">{`// Basic output
Run System::Console::printLine(String::Constructor("Hello, World!"));

// Print without newline
Run System::Console::print(String::Constructor("Enter name: "));

// Print error
Run System::Console::printError(String::Constructor("Error: file not found"));

// Formatted output
Run System::Console::printFormatted(
    String::Constructor("User: %s"),
    String::Constructor("Alice")
);`}</CodeBlock>

      <h3>Input Operations</h3>
      <MethodTable
        methods={[
          { name: "readLine", params: "", returns: "String^", desc: "Read line from stdin" },
          { name: "readChar", params: "", returns: "String^", desc: "Read single character" },
          { name: "readInt", params: "", returns: "Integer^", desc: "Read and parse integer" },
          { name: "readFloat", params: "", returns: "Float^", desc: "Read and parse float" },
          { name: "readDouble", params: "", returns: "Double^", desc: "Read and parse double" },
          { name: "readBool", params: "", returns: "Bool^", desc: "Read and parse boolean" },
        ]}
      />

      <CodeBlock language="xxml">{`// Read string input
Run System::Console::print(String::Constructor("Enter your name: "));
Instantiate String^ As <name> = System::Console::readLine();

// Read integer input
Run System::Console::print(String::Constructor("Enter your age: "));
Instantiate Integer^ As <age> = System::Console::readInt();

// Read boolean
Run System::Console::print(String::Constructor("Continue? (true/false): "));
Instantiate Bool^ As <continue> = System::Console::readBool();`}</CodeBlock>

      <h3>Time Operations</h3>
      <MethodTable
        methods={[
          { name: "getTime", params: "", returns: "Integer^", desc: "Get current Unix timestamp (seconds)" },
          { name: "getTimeMillis", params: "", returns: "Integer^", desc: "Get current time in milliseconds" },
          { name: "sleep", params: "milliseconds: Integer^", returns: "None", desc: "Pause execution" },
        ]}
      />

      <CodeBlock language="xxml">{`// Get current time
Instantiate Integer^ As <now> = System::Console::getTimeMillis();

// Measure execution time
Instantiate Integer^ As <start> = System::Console::getTimeMillis();

// ... do some work ...

Instantiate Integer^ As <end> = System::Console::getTimeMillis();
Instantiate Integer^ As <elapsed> = end.subtract(start);
Run System::Console::printLine(
    String::Constructor("Elapsed: ").append(elapsed.toString()).append(String::Constructor("ms"))
);

// Sleep for 1 second
Run System::Console::sleep(Integer::Constructor(1000));`}</CodeBlock>

      <h3>Environment</h3>
      <MethodTable
        methods={[
          { name: "getEnv", params: "varName: String^", returns: "String^", desc: "Get environment variable" },
          { name: "setEnv", params: "varName: String^, value: String^", returns: "Bool^", desc: "Set environment variable" },
        ]}
      />

      <CodeBlock language="xxml">{`// Get PATH environment variable
Instantiate String^ As <path> = System::Console::getEnv(String::Constructor("PATH"));
Run System::Console::printLine(String::Constructor("PATH: ").append(path));

// Set custom variable
Instantiate Bool^ As <success> = System::Console::setEnv(
    String::Constructor("MY_APP_MODE"),
    String::Constructor("production")
);`}</CodeBlock>

      <Callout type="info">
        Environment variable changes only affect the current process and any child
        processes spawned after the change.
      </Callout>

      <h3>Program Control</h3>
      <MethodTable
        methods={[
          { name: "exit", params: "exitCode: Integer^", returns: "None", desc: "Terminate program with exit code" },
          { name: "getArgs", params: "", returns: "None^", desc: "Get command line arguments" },
        ]}
      />

      <CodeBlock language="xxml">{`// Exit with success
Run System::Console::exit(Integer::Constructor(0));

// Exit with error
Run System::Console::exit(Integer::Constructor(1));`}</CodeBlock>

      <Callout type="warning">
        The <code>exit()</code> method immediately terminates the program. Any cleanup
        code after this call will not execute.
      </Callout>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="interactive_cli.xxml" showLineNumbers>{`#import Language::Core;
#import Language::System;

[ Entrypoint
    {
        // Welcome message
        Run System::Console::printLine(String::Constructor("=== XXML Calculator ==="));
        Run System::Console::printLine(String::Constructor(""));

        // Get first number
        Run System::Console::print(String::Constructor("Enter first number: "));
        Instantiate Integer^ As <a> = System::Console::readInt();

        // Get second number
        Run System::Console::print(String::Constructor("Enter second number: "));
        Instantiate Integer^ As <b> = System::Console::readInt();

        // Calculate and display
        Instantiate Integer^ As <sum> = a.add(b);
        Instantiate Integer^ As <product> = a.multiply(b);

        Run System::Console::printLine(String::Constructor(""));
        Run System::Console::printLine(
            String::Constructor("Sum: ").append(sum.toString())
        );
        Run System::Console::printLine(
            String::Constructor("Product: ").append(product.toString())
        );

        // Timing example
        Run System::Console::printLine(String::Constructor(""));
        Instantiate Integer^ As <timestamp> = System::Console::getTime();
        Run System::Console::printLine(
            String::Constructor("Timestamp: ").append(timestamp.toString())
        );

        // Environment variable
        Instantiate String^ As <user> = System::Console::getEnv(String::Constructor("USER"));
        Run System::Console::printLine(
            String::Constructor("Current user: ").append(user)
        );

        Run System::Console::exit(Integer::Constructor(0));
    }
]`}</CodeBlock>

      <h2>See Also</h2>
      <div className="not-prose mt-4 flex flex-wrap gap-2">
        <a href="/docs/standard-library/core" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Core Module
        </a>
        <a href="/docs/standard-library/time" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Time Module
        </a>
        <a href="/docs/standard-library/concurrent" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Concurrent Module
        </a>
      </div>
    </>
  );
}
