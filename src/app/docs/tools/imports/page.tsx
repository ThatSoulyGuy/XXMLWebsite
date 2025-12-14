import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Import System",
  description: "File-based module system in XXML",
};

export default function ImportsPage() {
  return (
    <>
      <h1>Import System</h1>
      <p className="lead">
        XXML uses a file-based module system for code organization and reuse.
        The <code>#import</code> directive loads all XXML files from a directory
        based on a qualified namespace path.
      </p>

      <h2>Syntax</h2>
      <CodeBlock language="xxml">{`#import Language::Core;`}</CodeBlock>
      <p>
        The <code>#import</code> directive takes a qualified namespace path and
        imports all XXML files found in the corresponding directory.
      </p>

      <h2>How Import Resolution Works</h2>

      <h3>1. Path Conversion</h3>
      <p>
        The namespace path is converted to a directory path by replacing{" "}
        <code>::</code> with <code>/</code>:
      </p>
      <CodeBlock language="text">{`Language::Core  →  Language/Core`}</CodeBlock>

      <h3>2. Search Path Lookup</h3>
      <p>
        The compiler searches for the directory in multiple locations, in order:
      </p>
      <ol>
        <li>
          <strong>Executable directory</strong> - The folder containing{" "}
          <code>xxml.exe</code>
        </li>
        <li>
          <strong>Language folder</strong> -{" "}
          <code>&lt;executable_dir&gt;/Language</code> (if it exists)
        </li>
        <li>
          <strong>Fallback Language folder</strong> - <code>./Language</code>{" "}
          relative to current directory
        </li>
        <li>
          <strong>Current directory</strong> - <code>.</code>
        </li>
        <li>
          <strong>Source file directory</strong> - The parent directory of the
          file being compiled
        </li>
      </ol>

      <h3>3. File Discovery</h3>
      <p>
        Once a matching directory is found, the compiler loads{" "}
        <strong>all</strong> <code>.XXML</code> files in that directory. For
        example, if <code>Language/Core/</code> contains:
      </p>
      <CodeBlock language="text">{`Language/Core/
├── String.XXML
├── Integer.XXML
├── Bool.XXML
└── Console.XXML`}</CodeBlock>
      <p>
        Then <code>#import Language::Core;</code> loads all four files.
      </p>

      <h3>4. Module Naming</h3>
      <p>Each file becomes a module with a name derived from its path:</p>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                File Path
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Module Name
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Language/Core/String.XXML</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <code>Language::Core::String</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Language/Core/Integer.XXML</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <code>Language::Core::Integer</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>MyLib/Utils.XXML</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <code>MyLib::Utils</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Module Caching</h2>
      <p>
        Modules are cached after first load to avoid redundant parsing. If a
        module is requested that has already been loaded, the cached version is
        returned.
      </p>

      <h2>Compiler Output</h2>
      <p>When the compiler finds modules, it prints diagnostic messages:</p>
      <CodeBlock language="text">{`✓ Found standard library at: C:/path/to/xxml/Language
✓ Added source directory to search paths: D:/MyProject
Auto-discovering XXML files in search paths...
  Scanning: C:/path/to/xxml
  Scanning: C:/path/to/xxml/Language
    Found: Language/Core/String.XXML -> Language::Core::String`}</CodeBlock>

      <h2>Example Project Structure</h2>
      <p>A typical project layout:</p>
      <CodeBlock language="text">{`xxml/
├── xxml.exe              # Compiler executable
└── Language/             # Standard library
    ├── Core/
    │   ├── String.XXML
    │   ├── Integer.XXML
    │   ├── Bool.XXML
    │   └── Console.XXML
    └── GLFW/
        └── GLFW.XXML     # Third-party library

MyProject/
├── Main.XXML             # Your code
└── Utils/
    └── Helpers.XXML      # Your modules`}</CodeBlock>

      <p>
        In <code>Main.XXML</code>:
      </p>
      <CodeBlock language="xxml">{`#import Language::Core;    // Loads all files from xxml/Language/Core/
#import Language::GLFW;    // Loads xxml/Language/GLFW/GLFW.XXML
#import Utils;             // Loads MyProject/Utils/*.XXML

[ Entrypoint
{
    // Use imported types
    Run Console::printLine(String::Constructor("Hello!"));
}]`}</CodeBlock>

      <h2>Importing Single-File Modules</h2>
      <p>
        Currently, XXML imports all files from a directory. To import from a
        single-file module, create a directory containing just that file:
      </p>
      <CodeBlock language="text">{`Language/
└── GLFW/
    └── GLFW.XXML    # Single file in directory`}</CodeBlock>
      <p>
        Then <code>#import Language::GLFW;</code> loads just{" "}
        <code>GLFW.XXML</code>.
      </p>

      <h2>Auto-Discovery</h2>
      <p>
        The import resolver can discover all XXML files in search paths
        automatically. This scans directories non-recursively and skips{" "}
        <code>build/</code> and <code>x64/</code> directories to avoid compiled
        artifacts.
      </p>

      <h2>Module Structure</h2>
      <p>Each module tracks:</p>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Field
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>moduleName</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Qualified name (e.g., <code>Language::Core::String</code>)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>filePath</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Path to the source file
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>fileContent</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Raw source code
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>ast</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Parsed abstract syntax tree
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>exportedSymbols</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Symbol table for exported declarations
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>imports</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                List of modules this module depends on
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>isParsed</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Whether parsing is complete
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>isAnalyzed</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Whether semantic analysis is complete
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>isCompiled</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Whether code generation is complete
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Error Handling</h2>
      <p>
        If the <code>Language</code> folder is not found, the compiler prints a
        warning:
      </p>
      <CodeBlock language="text">{`Warning: Language folder not found (searched: C:/path/to/xxml/Language and ./Language)`}</CodeBlock>

      <p>If a module file fails to load:</p>
      <CodeBlock language="text">{`Warning: Failed to load module file: path/to/File.XXML`}</CodeBlock>

      <Callout type="warning">
        Make sure the <code>Language/</code> directory exists relative to your
        compiler location or current working directory. Without it, standard
        library imports will fail.
      </Callout>

      <h2>Next Steps</h2>
      <p>
        Learn about the <a href="/docs/tools/cli">CLI Reference</a> for
        compilation options, or explore the{" "}
        <a href="/docs/tools/architecture">Compiler Architecture</a> for
        implementation details.
      </p>
    </>
  );
}
