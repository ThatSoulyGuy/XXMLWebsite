import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "CLI Reference",
  description: "Command-line interface for the XXML compiler",
};

export default function CLIPage() {
  return (
    <>
      <h1>CLI Reference</h1>
      <p className="lead">
        Command-line interface reference for the XXML compiler. Compile XXML
        source files to native executables or LLVM IR.
      </p>

      <h2>Synopsis</h2>
      <CodeBlock language="bash">{`xxml [options] <input.XXML> -o <output>`}</CodeBlock>

      <h2>Basic Usage</h2>

      <h3>Compile to Executable</h3>
      <CodeBlock language="bash">{`xxml Hello.XXML -o hello.exe`}</CodeBlock>

      <h3>Generate LLVM IR Only</h3>
      <CodeBlock language="bash">{`xxml Hello.XXML -o hello.ll --ir`}</CodeBlock>

      <h3>Legacy Mode (LLVM IR Only)</h3>
      <CodeBlock language="bash">{`xxml Hello.XXML -o hello.ll 2`}</CodeBlock>

      <h2>Options</h2>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Option
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>-o &lt;file&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Output file (.ll for IR, .exe/.dll for binary)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>--ir</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Generate LLVM IR only (same as mode 2)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>--processor</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Compile annotation processor to DLL
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>--use-processor=&lt;dll&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Load annotation processor DLL (can be repeated)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>--stl-warnings</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Show warnings for standard library files (off by default)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>2</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Legacy mode: LLVM IR only
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Output Formats</h2>

      <h3>Executable (.exe)</h3>
      <p>
        Default compilation target. Produces a native Windows executable.
      </p>
      <CodeBlock language="bash">{`xxml MyApp.XXML -o myapp.exe`}</CodeBlock>

      <h3>LLVM IR (.ll)</h3>
      <p>
        Human-readable LLVM intermediate representation. Useful for debugging
        and optimization analysis.
      </p>
      <CodeBlock language="bash">{`xxml MyApp.XXML -o myapp.ll --ir`}</CodeBlock>

      <h3>Dynamic Library (.dll)</h3>
      <p>For annotation processors or shared libraries.</p>
      <CodeBlock language="bash">{`xxml --processor MyProcessor.XXML -o MyProcessor.dll`}</CodeBlock>

      <h2>Annotation Processors</h2>

      <h3>Compiling a Processor</h3>
      <CodeBlock language="bash">{`xxml --processor MyAnnotation.XXML -o MyAnnotation.dll`}</CodeBlock>

      <h3>Using a Processor</h3>
      <CodeBlock language="bash">{`xxml --use-processor=MyAnnotation.dll App.XXML -o app.exe`}</CodeBlock>

      <h3>Multiple Processors</h3>
      <CodeBlock language="bash">{`xxml --use-processor=Proc1.dll --use-processor=Proc2.dll App.XXML -o app.exe`}</CodeBlock>

      <h2>Warning Control</h2>
      <p>
        By default, warnings from standard library files are suppressed. Enable
        them with:
      </p>
      <CodeBlock language="bash">{`xxml MyApp.XXML -o myapp.exe --stl-warnings`}</CodeBlock>

      <h2>Examples</h2>

      <h3>Basic Compilation</h3>
      <CodeBlock language="bash">{`# Compile hello world
xxml Hello.XXML -o hello.exe

# Run the executable
./hello.exe`}</CodeBlock>

      <h3>Debug with LLVM IR</h3>
      <CodeBlock language="bash">{`# Generate IR for inspection
xxml MyApp.XXML -o myapp.ll --ir

# View the generated IR
cat myapp.ll`}</CodeBlock>

      <h3>Annotation Processor Workflow</h3>
      <CodeBlock language="bash">{`# 1. Create annotation processor source (MyLogger.XXML)
# 2. Compile to DLL
xxml --processor MyLogger.XXML -o MyLogger.dll

# 3. Use processor when compiling application
xxml --use-processor=MyLogger.dll App.XXML -o app.exe`}</CodeBlock>

      <h2>Exit Codes</h2>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Code
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Meaning
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>0</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Successful compilation
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>1</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Error (missing arguments, file not found, compilation error)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>File Extensions</h2>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Extension
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>.XXML</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                XXML source file
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>.exe</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Native executable
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>.dll</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Dynamic library
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>.ll</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                LLVM IR text format
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Environment</h2>
      <p>The compiler expects:</p>
      <ul>
        <li>
          Standard library files in <code>Language/</code> subdirectory relative
          to compiler location
        </li>
        <li>
          LLVM tools (<code>llc</code>, <code>lld-link</code>) available in PATH
          for executable generation
        </li>
        <li>Visual Studio Build Tools for Windows linking</li>
      </ul>

      <h2>Compilation Pipeline</h2>
      <CodeBlock language="text">{`Source (.XXML)
    ↓
Lexical Analysis
    ↓
Syntax Analysis (AST)
    ↓
Semantic Analysis
    ↓
LLVM IR Generation (.ll)
    ↓
LLVM Compilation (.obj)
    ↓
Linking (.exe / .dll)`}</CodeBlock>

      <h2>Troubleshooting</h2>

      <h3>&quot;Could not open file&quot;</h3>
      <p>Verify the input file path exists and is accessible.</p>

      <h3>&quot;No output file specified&quot;</h3>
      <p>
        Use <code>-o</code> flag to specify output:{" "}
        <code>xxml input.XXML -o output.exe</code>
      </p>

      <h3>Linker Errors</h3>
      <p>
        Ensure LLVM tools and Visual Studio Build Tools are installed and in
        PATH.
      </p>

      <h3>Standard Library Not Found</h3>
      <p>
        Verify <code>Language/</code> directory exists relative to compiler
        location with core STL files.
      </p>

      <Callout type="info">
        For debugging compilation issues, use the <code>--ir</code> flag to
        generate LLVM IR and inspect the generated code.
      </Callout>

      <h2>Next Steps</h2>
      <p>
        Learn about the <a href="/docs/tools/imports">Import System</a> for
        module organization, or explore the{" "}
        <a href="/docs/tools/architecture">Compiler Architecture</a> for
        internals.
      </p>
    </>
  );
}
