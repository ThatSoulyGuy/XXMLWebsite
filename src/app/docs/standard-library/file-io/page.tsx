import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "File I/O",
  description: "File operations in XXML",
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

export default function FileIOPage() {
  return (
    <>
      <h1>File I/O</h1>
      <p className="lead">
        File operations for reading and writing files. The <code>IO::File</code> class
        provides both static utility methods and instance-based file operations.
      </p>

      <CodeBlock language="xxml">{`#import Language::Core;
#import Language::IO;`}</CodeBlock>

      <h2>Static Methods</h2>
      <p>
        Static methods provide quick operations without needing to create a file instance.
      </p>

      <h3>exists</h3>
      <p>Check if a file exists.</p>
      <MethodTable
        methods={[
          { name: "exists", params: "path: String^", returns: "Bool^", desc: "True if file exists" },
        ]}
      />
      <CodeBlock language="xxml">{`Instantiate Bool^ As <found> = IO::File::exists(String::Constructor("config.txt"));
If (found) -> {
    Run Console::printLine(String::Constructor("File exists"));
}`}</CodeBlock>

      <h3>delete</h3>
      <p>Delete a file.</p>
      <MethodTable
        methods={[
          { name: "delete", params: "path: String^", returns: "Bool^", desc: "True if deleted" },
        ]}
      />

      <h3>copy</h3>
      <p>Copy a file to a new location.</p>
      <MethodTable
        methods={[
          { name: "copy", params: "srcPath: String^, dstPath: String^", returns: "Bool^", desc: "True if copied" },
        ]}
      />
      <CodeBlock language="xxml">{`Instantiate Bool^ As <copied> = IO::File::copy(
    String::Constructor("source.txt"),
    String::Constructor("dest.txt")
);`}</CodeBlock>

      <h3>rename</h3>
      <p>Rename or move a file.</p>
      <MethodTable
        methods={[
          { name: "rename", params: "oldPath: String^, newPath: String^", returns: "Bool^", desc: "True if renamed" },
        ]}
      />

      <h3>sizeOf</h3>
      <p>Get file size in bytes.</p>
      <MethodTable
        methods={[
          { name: "sizeOf", params: "path: String^", returns: "Integer^", desc: "Size in bytes" },
        ]}
      />

      <h3>readAll</h3>
      <p>Read entire file content as a string.</p>
      <MethodTable
        methods={[
          { name: "readAll", params: "path: String^", returns: "String^", desc: "File content" },
        ]}
      />
      <CodeBlock language="xxml">{`Instantiate String^ As <content> = IO::File::readAll(String::Constructor("readme.txt"));
Run Console::printLine(content);`}</CodeBlock>

      <h2>Instance Methods</h2>

      <h3>Constructor</h3>
      <p>Open a file with a specific mode.</p>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">Mode</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm"><code>&quot;r&quot;</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Read (file must exist)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm"><code>&quot;w&quot;</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Write (creates or truncates)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm"><code>&quot;a&quot;</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Append (creates if needed)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CodeBlock language="xxml">{`// Read mode
Instantiate IO::File^ As <inFile> = IO::File::Constructor(
    String::Constructor("input.txt"),
    String::Constructor("r")
);

// Write mode (creates/truncates)
Instantiate IO::File^ As <outFile> = IO::File::Constructor(
    String::Constructor("output.txt"),
    String::Constructor("w")
);

// Append mode
Instantiate IO::File^ As <logFile> = IO::File::Constructor(
    String::Constructor("log.txt"),
    String::Constructor("a")
);`}</CodeBlock>

      <h3>File State</h3>
      <MethodTable
        methods={[
          { name: "close", params: "", returns: "None^", desc: "Close file handle" },
          { name: "isOpen", params: "", returns: "Bool^", desc: "True if file is open" },
          { name: "eof", params: "", returns: "Bool^", desc: "True if at end of file" },
          { name: "size", params: "", returns: "Integer^", desc: "Size in bytes" },
        ]}
      />

      <h3>Reading</h3>
      <MethodTable
        methods={[
          { name: "readLine", params: "", returns: "String^", desc: "Read next line" },
        ]}
      />
      <CodeBlock language="xxml">{`While (file.eof().not()) -> {
    Instantiate String^ As <line> = file.readLine();
    Run Console::printLine(line);
}`}</CodeBlock>

      <h3>Writing</h3>
      <MethodTable
        methods={[
          { name: "writeString", params: "text: String^", returns: "Integer^", desc: "Bytes written" },
          { name: "writeLine", params: "text: String^", returns: "Integer^", desc: "Bytes written (with newline)" },
          { name: "flush", params: "", returns: "Integer^", desc: "Flush buffered data to disk" },
        ]}
      />
      <CodeBlock language="xxml">{`Run file.writeLine(String::Constructor("Line 1"));
Run file.writeLine(String::Constructor("Line 2"));
Run file.flush();`}</CodeBlock>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="file_io_example.xxml" showLineNumbers>{`#import Language::Core;
#import Language::IO;
#import Language::System;

[ Entrypoint
    {
        // Write a file
        Instantiate IO::File^ As <out> = IO::File::Constructor(
            String::Constructor("example.txt"),
            String::Constructor("w")
        );
        Run out.writeLine(String::Constructor("Hello, World!"));
        Run out.writeLine(String::Constructor("This is XXML file I/O."));
        Run out.close();

        // Check file exists and size
        If (IO::File::exists(String::Constructor("example.txt"))) -> {
            Instantiate Integer^ As <size> = IO::File::sizeOf(String::Constructor("example.txt"));
            Run Console::printLine(String::Constructor("File size: ").append(size.toString()).append(String::Constructor(" bytes")));
        }

        // Read file line by line
        Instantiate IO::File^ As <in> = IO::File::Constructor(
            String::Constructor("example.txt"),
            String::Constructor("r")
        );
        Run Console::printLine(String::Constructor("Contents:"));
        While (in.eof().not()) -> {
            Instantiate String^ As <line> = in.readLine();
            Run Console::printLine(line);
        }
        Run in.close();

        // Read entire file at once
        Instantiate String^ As <all> = IO::File::readAll(String::Constructor("example.txt"));
        Run Console::printLine(String::Constructor("Full content:"));
        Run Console::printLine(all);

        // Cleanup
        Run IO::File::delete(String::Constructor("example.txt"));

        Exit(0);
    }
]`}</CodeBlock>

      <h2>See Also</h2>
      <div className="not-prose mt-4 flex flex-wrap gap-2">
        <a href="/docs/standard-library/console" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Console
        </a>
        <a href="/docs/standard-library/core" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Core Types
        </a>
      </div>
    </>
  );
}
