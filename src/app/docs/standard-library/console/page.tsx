import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Console",
  description: "Console I/O operations in XXML",
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

export default function ConsolePage() {
  return (
    <>
      <h1>Console</h1>
      <p className="lead">
        Console I/O operations for terminal interaction. The <code>Console</code> class
        provides static methods for input, output, timing, and system utilities.
      </p>

      <CodeBlock language="xxml">{`#import Language::Core;
#import Language::System;`}</CodeBlock>

      <h2>Output Methods</h2>

      <h3>print</h3>
      <p>Write text without a trailing newline.</p>
      <MethodTable
        methods={[
          { name: "print", params: "message: String^", returns: "None", desc: "Write to stdout" },
        ]}
      />
      <CodeBlock language="xxml">{`Run Console::print(String::Constructor("Hello "));
Run Console::print(String::Constructor("World"));
// Output: Hello World (on same line)`}</CodeBlock>

      <h3>printLine</h3>
      <p>Write text with a trailing newline.</p>
      <MethodTable
        methods={[
          { name: "printLine", params: "message: String^", returns: "None", desc: "Write line to stdout" },
        ]}
      />
      <CodeBlock language="xxml">{`Run Console::printLine(String::Constructor("Hello World"));
Run Console::printLine(String::Constructor("Next line"));`}</CodeBlock>

      <h3>printError</h3>
      <p>Write to standard error stream.</p>
      <MethodTable
        methods={[
          { name: "printError", params: "message: String^", returns: "None", desc: "Write to stderr" },
        ]}
      />
      <CodeBlock language="xxml">{`Run Console::printError(String::Constructor("Error: file not found"));`}</CodeBlock>

      <h3>printFormatted</h3>
      <p>Formatted output with placeholder substitution.</p>
      <MethodTable
        methods={[
          { name: "printFormatted", params: "format: String^, value: String^", returns: "None", desc: "Printf-style output" },
        ]}
      />
      <CodeBlock language="xxml">{`Run Console::printFormatted(String::Constructor("Name: %s"), String::Constructor("Alice"));`}</CodeBlock>

      <h3>clear</h3>
      <p>Clear the console screen.</p>
      <MethodTable
        methods={[
          { name: "clear", params: "", returns: "None", desc: "Clear terminal" },
        ]}
      />

      <h2>Input Methods</h2>

      <h3>readLine</h3>
      <p>Read a line of text from stdin.</p>
      <MethodTable
        methods={[
          { name: "readLine", params: "", returns: "String^", desc: "Read line from stdin" },
        ]}
      />
      <CodeBlock language="xxml">{`Run Console::print(String::Constructor("Enter name: "));
Instantiate String^ As <name> = Console::readLine();
Run Console::printLine(String::Constructor("Hello, ").append(name));`}</CodeBlock>

      <h3>readChar</h3>
      <p>Read a single character.</p>
      <MethodTable
        methods={[
          { name: "readChar", params: "", returns: "String^", desc: "Read single character" },
        ]}
      />

      <h3>readInt</h3>
      <p>Read and parse an integer.</p>
      <MethodTable
        methods={[
          { name: "readInt", params: "", returns: "Integer^", desc: "Read and parse integer" },
        ]}
      />
      <CodeBlock language="xxml">{`Run Console::print(String::Constructor("Enter age: "));
Instantiate Integer^ As <age> = Console::readInt();`}</CodeBlock>

      <h3>readFloat / readDouble / readBool</h3>
      <p>Read and parse other primitive types.</p>
      <MethodTable
        methods={[
          { name: "readFloat", params: "", returns: "Float^", desc: "Read and parse float" },
          { name: "readDouble", params: "", returns: "Double^", desc: "Read and parse double" },
          { name: "readBool", params: "", returns: "Bool^", desc: "Read and parse boolean" },
        ]}
      />

      <h2>System Utilities</h2>

      <h3>getTime / getTimeMillis</h3>
      <p>Get current time since epoch.</p>
      <MethodTable
        methods={[
          { name: "getTime", params: "", returns: "Integer^", desc: "Seconds since epoch" },
          { name: "getTimeMillis", params: "", returns: "Integer^", desc: "Milliseconds since epoch" },
        ]}
      />
      <CodeBlock language="xxml">{`Instantiate Integer^ As <now> = Console::getTime();
Instantiate Integer^ As <nowMs> = Console::getTimeMillis();`}</CodeBlock>

      <h3>sleep</h3>
      <p>Pause execution for a specified duration.</p>
      <MethodTable
        methods={[
          { name: "sleep", params: "milliseconds: Integer^", returns: "None", desc: "Pause for duration" },
        ]}
      />
      <CodeBlock language="xxml">{`Run Console::sleep(Integer::Constructor(1000));  // Sleep 1 second`}</CodeBlock>

      <h3>exit</h3>
      <p>Terminate the program with an exit code.</p>
      <MethodTable
        methods={[
          { name: "exit", params: "exitCode: Integer^", returns: "None", desc: "Terminate process" },
        ]}
      />
      <CodeBlock language="xxml">{`Run Console::exit(Integer::Constructor(0));  // Exit with code 0`}</CodeBlock>

      <h2>Environment Variables</h2>

      <h3>getEnv / setEnv</h3>
      <p>Access and modify environment variables.</p>
      <MethodTable
        methods={[
          { name: "getEnv", params: "varName: String^", returns: "String^", desc: "Get env variable" },
          { name: "setEnv", params: "varName: String^, value: String^", returns: "Bool^", desc: "Set env variable" },
        ]}
      />
      <CodeBlock language="xxml">{`Instantiate String^ As <path> = Console::getEnv(String::Constructor("PATH"));

Instantiate Bool^ As <success> = Console::setEnv(
    String::Constructor("MY_VAR"),
    String::Constructor("my_value")
);`}</CodeBlock>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="console_example.xxml" showLineNumbers>{`#import Language::Core;
#import Language::System;

[ Entrypoint
    {
        // Greet user
        Run Console::print(String::Constructor("What is your name? "));
        Instantiate String^ As <name> = Console::readLine();

        Run Console::print(String::Constructor("How old are you? "));
        Instantiate Integer^ As <age> = Console::readInt();

        // Display info
        Run Console::printLine(String::Constructor(""));
        Run Console::printLine(String::Constructor("Hello, ").append(name).append(String::Constructor("!")));
        Run Console::printLine(String::Constructor("You are ").append(age.toString()).append(String::Constructor(" years old.")));

        // Timing example
        Instantiate Integer^ As <start> = Console::getTimeMillis();
        Run Console::sleep(Integer::Constructor(500));
        Instantiate Integer^ As <elapsed> = Console::getTimeMillis().subtract(start);
        Run Console::printLine(String::Constructor("Waited ").append(elapsed.toString()).append(String::Constructor("ms")));

        Exit(0);
    }
]`}</CodeBlock>

      <h2>See Also</h2>
      <div className="not-prose mt-4 flex flex-wrap gap-2">
        <a href="/docs/standard-library/core" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Core Types
        </a>
        <a href="/docs/standard-library/file-io" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          File I/O
        </a>
      </div>
    </>
  );
}
