import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "VS Code Extension",
  description: "IDE support for XXML in Visual Studio Code",
};

export default function VSCodePage() {
  return (
    <>
      <h1>VS Code Extension</h1>
      <p className="lead">
        The XXML VS Code extension provides full IDE support including syntax
        highlighting, diagnostics, code navigation, and ownership visualization.
      </p>

      <h2>Features</h2>

      <h3>Syntax Highlighting</h3>
      <p>
        Full syntax highlighting for XXML source files (<code>.XXML</code>):
      </p>
      <ul>
        <li>
          Keywords (<code>Class</code>, <code>Method</code>,{" "}
          <code>Property</code>, <code>Instantiate</code>, etc.)
        </li>
        <li>Types and type parameters</li>
        <li>
          Ownership modifiers (<code>^</code>, <code>&amp;</code>,{" "}
          <code>%</code>)
        </li>
        <li>Strings and comments</li>
        <li>
          Annotations (<code>@Derive</code>, <code>@Test</code>, etc.)
        </li>
      </ul>

      <h3>Language Server Integration</h3>
      <p>Real-time IDE features powered by the XXML Language Server:</p>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Feature
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Diagnostics</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Syntax and semantic errors as you type
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Go to Definition</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Jump to class, method, or property definitions
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Hover Information</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Type info and documentation on hover
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Code Completion</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                IntelliSense for keywords and symbols
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium">Find References</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Find all usages of a symbol
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Ownership Visualization</h3>
      <p>Visual highlighting of ownership modifiers with distinct colors:</p>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Modifier
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Color
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Meaning
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>^</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="text-green-600 dark:text-green-400">Green</span>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <strong>Owned</strong> - Unique ownership, responsible for
                lifetime
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>&amp;</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="text-blue-600 dark:text-blue-400">Blue</span>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <strong>Reference</strong> - Borrowed, cannot outlive owner
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>%</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="text-orange-600 dark:text-orange-400">
                  Orange
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <strong>Copy</strong> - Independent bitwise copy
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Installation</h2>

      <h3>From VSIX Package</h3>
      <ol>
        <li>
          Build the extension package:
          <CodeBlock language="bash">{`cd tools/vscode-xxml
npm install
npm run package`}</CodeBlock>
        </li>
        <li>
          Install in VS Code:
          <CodeBlock language="bash">{`code --install-extension xxml-language-0.1.0.vsix`}</CodeBlock>
        </li>
      </ol>

      <h3>For Development</h3>
      <ol>
        <li>
          Install dependencies:
          <CodeBlock language="bash">{`cd tools/vscode-xxml
npm install`}</CodeBlock>
        </li>
        <li>
          Compile TypeScript:
          <CodeBlock language="bash">{`npm run compile`}</CodeBlock>
        </li>
        <li>
          Press <strong>F5</strong> in VS Code to launch the Extension
          Development Host.
        </li>
      </ol>

      <h2>Configuration</h2>
      <p>
        Access settings via <strong>File &gt; Preferences &gt; Settings</strong>{" "}
        and search for &quot;XXML&quot;.
      </p>

      <h3>Available Settings</h3>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Setting
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Default
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>xxml.languageServer.path</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <code>&quot;&quot;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Path to <code>xxml-lsp</code> executable. Leave empty to search
                in PATH.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>xxml.languageServer.enabled</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <code>true</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Enable/disable the language server
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>xxml.ownershipVisualization.enabled</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <code>true</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Show ownership modifier highlighting
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Example settings.json</h3>
      <CodeBlock language="json">{`{
    "xxml.languageServer.path": "C:/path/to/xxml-lsp.exe",
    "xxml.languageServer.enabled": true,
    "xxml.ownershipVisualization.enabled": true
}`}</CodeBlock>

      <h2>Ownership Visualization</h2>
      <p>
        The extension highlights ownership modifiers inline to help visualize
        memory management:
      </p>
      <CodeBlock language="xxml">{`Property <data> Types Integer^;    // ^ highlighted in green
Method <process> Returns None Parameters (
    Parameter <input> Types String&    // & highlighted in blue
) Do { ... }`}</CodeBlock>

      <h3>Enabling/Disabling</h3>
      <p>Toggle via settings:</p>
      <CodeBlock language="json">{`{
    "xxml.ownershipVisualization.enabled": false
}`}</CodeBlock>
      <p>Or use the command palette:</p>
      <ol>
        <li>
          Press <code>Ctrl+Shift+P</code> (or <code>Cmd+Shift+P</code> on Mac)
        </li>
        <li>
          Search for &quot;XXML: Toggle Ownership Visualization&quot;
        </li>
      </ol>

      <h2>Language Server</h2>
      <p>
        The XXML Language Server (<code>xxml-lsp</code>) provides IDE
        intelligence.
      </p>

      <Callout type="info">
        The language server must be installed for full functionality. Without
        it, only syntax highlighting is available.
      </Callout>

      <h3>LSP Capabilities</h3>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Capability
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>textDocument/didOpen</code>
              </td>
              <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                Supported
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>textDocument/didChange</code>
              </td>
              <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                Supported
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>textDocument/didClose</code>
              </td>
              <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                Supported
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>textDocument/completion</code>
              </td>
              <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                Supported
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>textDocument/hover</code>
              </td>
              <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                Supported
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>textDocument/definition</code>
              </td>
              <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                Supported
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>textDocument/references</code>
              </td>
              <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                Supported
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>textDocument/publishDiagnostics</code>
              </td>
              <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                Supported
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Building from Source</h2>

      <h3>Build the Language Server</h3>
      <CodeBlock language="bash">{`cd /path/to/XXMLCompiler
cmake --preset release
cmake --build --preset release --target xxml-lsp`}</CodeBlock>
      <p>
        The server is built at <code>build/release/bin/xxml-lsp.exe</code>.
      </p>

      <h3>Build the VS Code Extension</h3>
      <CodeBlock language="bash">{`cd tools/vscode-xxml

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Package as VSIX
npm run package`}</CodeBlock>

      <h3>Project Structure</h3>
      <CodeBlock language="text">{`tools/vscode-xxml/
├── src/
│   └── extension.ts          # Extension entry point
├── syntaxes/
│   └── xxml.tmLanguage.json  # TextMate grammar for highlighting
├── language-configuration.json # Bracket matching, comments
├── package.json              # Extension manifest
└── tsconfig.json             # TypeScript configuration`}</CodeBlock>

      <h2>File Associations</h2>
      <p>
        The extension automatically associates with <code>.XXML</code> files. To
        add additional patterns:
      </p>
      <CodeBlock language="json">{`{
    "files.associations": {
        "*.xxml": "xxml",
        "*.XXML": "xxml"
    }
}`}</CodeBlock>

      <h2>Keyboard Shortcuts</h2>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Shortcut
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>F12</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Go to Definition
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Shift+F12</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Find All References
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Ctrl+Space</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Trigger Completion
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Ctrl+Shift+Space</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Parameter Hints
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>F2</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Rename Symbol
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Troubleshooting</h2>

      <h3>&quot;Language server not found&quot;</h3>
      <ul>
        <li>
          Verify <code>xxml-lsp.exe</code> is in PATH or configure{" "}
          <code>xxml.languageServer.path</code>
        </li>
        <li>
          Check the Output panel (View &gt; Output &gt; XXML Language Server)
        </li>
      </ul>

      <h3>&quot;No diagnostics showing&quot;</h3>
      <ul>
        <li>
          Ensure <code>xxml.languageServer.enabled</code> is <code>true</code>
        </li>
        <li>Check that the language server started successfully</li>
        <li>Look for errors in the Output panel</li>
      </ul>

      <h2>Known Limitations</h2>
      <ul>
        <li>
          <strong>Rename not fully implemented</strong> - Rename across files
          may not work correctly
        </li>
        <li>
          <strong>No debugging support</strong> - The extension does not include
          a debug adapter
        </li>
        <li>
          <strong>Limited refactoring</strong> - Extract method/variable not
          supported
        </li>
      </ul>

      <h2>Next Steps</h2>
      <p>
        Learn about the <a href="/docs/tools/cli">CLI Reference</a> for compiler
        options, or explore the{" "}
        <a href="/docs/tools/architecture">Compiler Architecture</a> for
        internals.
      </p>
    </>
  );
}
