export const metadata = {
  title: "Hello World",
  description: "Write your first XXML program",
};

export default function HelloWorldPage() {
  return (
    <>
      <h1>Hello World</h1>
      <p className="lead">
        Let&apos;s write your first XXML program - the classic &quot;Hello, World!&quot;
      </p>

      <h2>The Code</h2>
      <p>Create a new file called <code>hello.xxml</code> with the following content:</p>
      <pre>
        <code>{`#import Language::Core;

[ Entrypoint
{
    Instantiate String^ As <message> = String::Constructor("Hello, World!");
    Run Console::printLine(message);
    Exit(0);
}
]`}</code>
      </pre>

      <h2>Understanding the Code</h2>

      <h3>Imports</h3>
      <pre>
        <code>{`#import Language::Core;`}</code>
      </pre>
      <p>
        This imports the Core module from the standard library, which provides essential
        types like <code>String</code> and functions like <code>Console::printLine</code>.
      </p>

      <h3>Entrypoint</h3>
      <pre>
        <code>{`[ Entrypoint
{
    // Your code here
}
]`}</code>
      </pre>
      <p>
        The <code>Entrypoint</code> block defines where your program starts executing.
        Every XXML program needs exactly one entrypoint.
      </p>

      <h3>Variables with Ownership</h3>
      <pre>
        <code>{`Instantiate String^ As <message> = String::Constructor("Hello, World!");`}</code>
      </pre>
      <p>
        This creates an owned (<code>^</code>) String variable. The ownership modifier
        indicates that this variable owns the memory for the string.
      </p>

      <h3>Calling Functions</h3>
      <pre>
        <code>{`Run Console::printLine(message);`}</code>
      </pre>
      <p>
        The <code>Run</code> keyword executes a function. Here we&apos;re calling
        <code>Console::printLine</code> to output our message to the console.
      </p>

      <h2>Compile and Run</h2>
      <pre>
        <code>{`xxml hello.xxml hello.exe
./hello.exe`}</code>
      </pre>
      <p>You should see:</p>
      <pre>
        <code>Hello, World!</code>
      </pre>

      <h2>Next Steps</h2>
      <p>
        Congratulations! You&apos;ve written your first XXML program. Continue to the{" "}
        <a href="/docs/language-reference/ownership">Ownership guide</a> to learn about
        XXML&apos;s unique memory management system.
      </p>
    </>
  );
}
