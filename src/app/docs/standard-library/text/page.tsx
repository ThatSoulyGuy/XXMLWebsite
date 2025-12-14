import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Text Module",
  description: "XXML Language::Text module reference",
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

export default function TextPage() {
  return (
    <>
      <h1>Text Module</h1>
      <p className="lead">
        The <code>Language::Text</code> module provides string utilities and
        regular expression pattern matching.
      </p>

      <CodeBlock language="xxml">{`#import Language::Text;`}</CodeBlock>

      <div className="not-prose my-8 grid gap-2 sm:grid-cols-2">
        {["StringUtils", "Pattern"].map((cls) => (
          <a
            key={cls}
            href={`#${cls.toLowerCase()}`}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-center text-sm font-medium text-zinc-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300"
          >
            {cls}
          </a>
        ))}
      </div>

      <ClassHeader name="StringUtils" description="Static utility class for string manipulation operations." />

      <h3>Trimming and Case</h3>
      <MethodTable
        methods={[
          { name: "trim", params: "str: String^", returns: "String^", desc: "Remove leading/trailing whitespace" },
          { name: "toLowerCase", params: "str: String^", returns: "String^", desc: "Convert to lowercase" },
          { name: "toUpperCase", params: "str: String^", returns: "String^", desc: "Convert to uppercase" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate String^ As <input> = String::Constructor("  Hello World  ");
Instantiate String^ As <trimmed> = Text::StringUtils::trim(input);  // "Hello World"
Instantiate String^ As <lower> = Text::StringUtils::toLowerCase(trimmed);  // "hello world"
Instantiate String^ As <upper> = Text::StringUtils::toUpperCase(trimmed);  // "HELLO WORLD"`}</CodeBlock>

      <h3>Search and Test</h3>
      <MethodTable
        methods={[
          { name: "startsWith", params: "str: String^, prefix: String^", returns: "Bool^", desc: "Check prefix" },
          { name: "endsWith", params: "str: String^, suffix: String^", returns: "Bool^", desc: "Check suffix" },
          { name: "contains", params: "str: String^, search: String^", returns: "Bool^", desc: "Check substring" },
          { name: "indexOf", params: "str: String^, search: String^", returns: "Integer^", desc: "First occurrence index (-1 if not found)" },
          { name: "lastIndexOf", params: "str: String^, search: String^", returns: "Integer^", desc: "Last occurrence index" },
          { name: "isEmpty", params: "str: String^", returns: "Bool^", desc: "Check if empty" },
          { name: "isBlank", params: "str: String^", returns: "Bool^", desc: "Check if empty or whitespace only" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate String^ As <path> = String::Constructor("/home/user/file.txt");

If (Text::StringUtils::startsWith(path, String::Constructor("/")).toBool())
{
    Run System::Console::printLine(String::Constructor("Absolute path"));
}

If (Text::StringUtils::endsWith(path, String::Constructor(".txt")).toBool())
{
    Run System::Console::printLine(String::Constructor("Text file"));
}

Instantiate Integer^ As <slashPos> = Text::StringUtils::lastIndexOf(
    path,
    String::Constructor("/")
);`}</CodeBlock>

      <h3>Substrings and Extraction</h3>
      <MethodTable
        methods={[
          { name: "substring", params: "str: String^, start: Integer^, end: Integer^", returns: "String^", desc: "Extract substring" },
        ]}
      />

      <h3>Replace and Transform</h3>
      <MethodTable
        methods={[
          { name: "replace", params: "str: String^, old: String^, new: String^", returns: "String^", desc: "Replace first occurrence" },
          { name: "replaceAll", params: "str: String^, old: String^, new: String^", returns: "String^", desc: "Replace all occurrences" },
          { name: "repeat", params: "str: String^, count: Integer^", returns: "String^", desc: "Repeat string N times" },
          { name: "reverse", params: "str: String^", returns: "String^", desc: "Reverse string" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate String^ As <text> = String::Constructor("hello world");
Instantiate String^ As <replaced> = Text::StringUtils::replaceAll(
    text,
    String::Constructor("o"),
    String::Constructor("0")
);  // "hell0 w0rld"

Instantiate String^ As <separator> = Text::StringUtils::repeat(
    String::Constructor("-"),
    Integer::Constructor(20)
);  // "--------------------"

Instantiate String^ As <reversed> = Text::StringUtils::reverse(text);  // "dlrow olleh"`}</CodeBlock>

      <h3>Split and Join</h3>
      <MethodTable
        methods={[
          { name: "split", params: "str: String^, delimiter: String^", returns: "List<String>^", desc: "Split by delimiter" },
          { name: "join", params: "parts: List<String>^, delimiter: String^", returns: "String^", desc: "Join with delimiter" },
        ]}
      />

      <CodeBlock language="xxml">{`// Split CSV
Instantiate String^ As <csv> = String::Constructor("apple,banana,cherry");
Instantiate Collections::List<String>^ As <fruits> = Text::StringUtils::split(
    csv,
    String::Constructor(",")
);

// Join with different delimiter
Instantiate String^ As <joined> = Text::StringUtils::join(
    fruits,
    String::Constructor(" | ")
);  // "apple | banana | cherry"`}</CodeBlock>

      <h3>Padding</h3>
      <MethodTable
        methods={[
          { name: "padLeft", params: "str: String^, length: Integer^, pad: String^", returns: "String^", desc: "Pad on left" },
          { name: "padRight", params: "str: String^, length: Integer^, pad: String^", returns: "String^", desc: "Pad on right" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate String^ As <num> = String::Constructor("42");
Instantiate String^ As <padded> = Text::StringUtils::padLeft(
    num,
    Integer::Constructor(5),
    String::Constructor("0")
);  // "00042"

Instantiate String^ As <label> = Text::StringUtils::padRight(
    String::Constructor("Name"),
    Integer::Constructor(10),
    String::Constructor(" ")
);  // "Name      "`}</CodeBlock>

      <h3>Formatting</h3>
      <MethodTable
        methods={[
          { name: "format", params: "template: String^, args: List<String>^", returns: "String^", desc: "Format with placeholders" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Collections::List<String>^ As <args> = Collections::List@String::Constructor();
Run args.add(String::Constructor("Alice"));
Run args.add(String::Constructor("30"));

Instantiate String^ As <message> = Text::StringUtils::format(
    String::Constructor("Name: {0}, Age: {1}"),
    args
);  // "Name: Alice, Age: 30"`}</CodeBlock>

      <ClassHeader name="Pattern" description="Regular expression pattern matching and text manipulation." />

      <h3>Creating Patterns</h3>
      <MethodTable
        methods={[
          { name: "compile", params: "regex: String^", returns: "Pattern^", desc: "Compile regex pattern (static)" },
        ]}
      />

      <h3>Matching</h3>
      <MethodTable
        methods={[
          { name: "match", params: "text: String^", returns: "Bool^", desc: "Test if entire string matches" },
          { name: "find", params: "text: String^", returns: "String^", desc: "Find first match" },
          { name: "findAll", params: "text: String^", returns: "List<String>^", desc: "Find all matches" },
          { name: "test", params: "text: String^", returns: "Bool^", desc: "Test if pattern appears anywhere" },
        ]}
      />

      <CodeBlock language="xxml">{`// Create a pattern for digits
Instantiate Text::Pattern^ As <digits> = Text::Pattern::compile(
    String::Constructor("\\\\d+")
);

Instantiate String^ As <text> = String::Constructor("Order 123 has 45 items");

// Check if pattern matches anywhere
If (digits.test(text).toBool())
{
    Run System::Console::printLine(String::Constructor("Found digits!"));
}

// Find first match
Instantiate String^ As <first> = digits.find(text);  // "123"

// Find all matches
Instantiate Collections::List<String>^ As <numbers> = digits.findAll(text);
// ["123", "45"]`}</CodeBlock>

      <h3>Replacement</h3>
      <MethodTable
        methods={[
          { name: "replace", params: "text: String^, replacement: String^", returns: "String^", desc: "Replace first match" },
          { name: "replaceAll", params: "text: String^, replacement: String^", returns: "String^", desc: "Replace all matches" },
          { name: "split", params: "text: String^", returns: "List<String>^", desc: "Split by pattern" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Text::Pattern^ As <whitespace> = Text::Pattern::compile(
    String::Constructor("\\\\s+")
);

Instantiate String^ As <text> = String::Constructor("hello   world   test");

// Replace multiple spaces with single space
Instantiate String^ As <normalized> = whitespace.replaceAll(
    text,
    String::Constructor(" ")
);  // "hello world test"

// Split by whitespace
Instantiate Collections::List<String>^ As <words> = whitespace.split(text);
// ["hello", "world", "test"]`}</CodeBlock>

      <Callout type="info">
        Regex patterns use standard regex syntax. Remember to escape backslashes
        in XXML strings: use <code>\\\\d</code> for the digit pattern <code>\d</code>.
      </Callout>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="text_processing.xxml" showLineNumbers>{`#import Language::Core;
#import Language::Text;
#import Language::Collections;
#import Language::System;

[ Entrypoint
    {
        // Parse and validate email
        Instantiate String^ As <email> = String::Constructor("  User@Example.COM  ");

        // Clean up input
        Set email = Text::StringUtils::trim(email);
        Set email = Text::StringUtils::toLowerCase(email);

        Run System::Console::printLine(
            String::Constructor("Normalized email: ").append(email)
        );

        // Validate email format with regex
        Instantiate Text::Pattern^ As <emailPattern> = Text::Pattern::compile(
            String::Constructor("^[a-z0-9._%+-]+@[a-z0-9.-]+\\\\.[a-z]{2,}$")
        );

        If (emailPattern.match(email).toBool())
        {
            Run System::Console::printLine(String::Constructor("Valid email!"));

            // Extract parts
            Instantiate Collections::List<String>^ As <parts> = Text::StringUtils::split(
                email,
                String::Constructor("@")
            );
            Run System::Console::printLine(
                String::Constructor("  Username: ").append(parts.get(Integer::Constructor(0)))
            );
            Run System::Console::printLine(
                String::Constructor("  Domain: ").append(parts.get(Integer::Constructor(1)))
            );
        }

        // Parse log line
        Run System::Console::printLine(String::Constructor(""));
        Instantiate String^ As <logLine> = String::Constructor(
            "[2024-01-15 10:30:45] ERROR: Connection failed (code: 500)"
        );

        // Extract numbers from log
        Instantiate Text::Pattern^ As <numPattern> = Text::Pattern::compile(
            String::Constructor("\\\\d+")
        );
        Instantiate Collections::List<String>^ As <numbers> = numPattern.findAll(logLine);

        Run System::Console::printLine(String::Constructor("Numbers in log:"));
        For (Instantiate Integer^ As <i> = Integer::Constructor(0);
             i.lessThan(numbers.size()).toBool();
             Set i = i.add(Integer::Constructor(1)))
        {
            Run System::Console::printLine(
                String::Constructor("  ").append(numbers.get(i))
            );
        }

        Exit(0);
    }
]`}</CodeBlock>

      <h2>See Also</h2>
      <div className="not-prose mt-4 flex flex-wrap gap-2">
        <a href="/docs/standard-library/core" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Core Module
        </a>
        <a href="/docs/standard-library/format" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Format Module
        </a>
      </div>
    </>
  );
}
