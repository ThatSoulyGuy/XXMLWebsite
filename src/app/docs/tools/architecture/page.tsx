import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Compiler Architecture",
  description: "XXML compiler internals and design",
};

export default function ArchitecturePage() {
  return (
    <>
      <h1>Compiler Architecture</h1>
      <p className="lead">
        The XXML compiler is a multi-stage compiler that converts XXML source
        code to native executables via LLVM IR. It follows a traditional
        compiler architecture with distinct phases.
      </p>

      <h2>Compilation Pipeline</h2>
      <CodeBlock language="text">{`Source Code (.XXML)
       ↓
   [Lexer] ← Error Reporter
       ↓
    Tokens
       ↓
   [Parser] ← Error Reporter
       ↓
     AST
       ↓
[Semantic Analyzer] ← Symbol Table ← Error Reporter
       ↓
  Validated AST
       ↓
[LLVM Backend] ← Error Reporter
       ↓
  LLVM IR (.ll)
       ↓
[Clang/LLVM]
       ↓
  Object Code (.obj)
       ↓
[Platform Linker] + Runtime Library
       ↓
  Native Executable`}</CodeBlock>

      <h2>Phase 1: Lexical Analysis</h2>
      <p>
        The lexer tokenizes source code into a stream of tokens, handling
        keywords, identifiers, literals, and operators.
      </p>

      <h3>Token Types</h3>
      <ul>
        <li>
          <strong>Keywords:</strong> <code>import</code>, <code>Namespace</code>
          , <code>Class</code>, <code>Method</code>, etc.
        </li>
        <li>
          <strong>Identifiers:</strong> Regular and angle-bracketed (
          <code>&lt;name&gt;</code>)
        </li>
        <li>
          <strong>Literals:</strong> Integer (<code>42i</code>), String (
          <code>&quot;text&quot;</code>), Boolean
        </li>
        <li>
          <strong>Operators:</strong> <code>+</code>, <code>-</code>,{" "}
          <code>*</code>, <code>/</code>, <code>::</code>, <code>.</code>,{" "}
          <code>-&gt;</code>, etc.
        </li>
        <li>
          <strong>Delimiters:</strong> <code>[</code>, <code>]</code>,{" "}
          <code>&#123;</code>, <code>&#125;</code>, <code>(</code>,{" "}
          <code>)</code>, <code>;</code>, <code>,</code>
        </li>
        <li>
          <strong>Special:</strong> <code>^</code>, <code>&amp;</code>,{" "}
          <code>%</code> (ownership modifiers)
        </li>
      </ul>

      <h2>Phase 2: Syntax Analysis</h2>
      <p>
        The parser uses recursive descent with precedence climbing for
        expressions, building an Abstract Syntax Tree (AST).
      </p>

      <h3>AST Hierarchy</h3>
      <CodeBlock language="text">{`ASTNode (abstract)
├── Declaration
│   ├── ImportDecl
│   ├── NamespaceDecl
│   ├── ClassDecl
│   ├── PropertyDecl
│   ├── ConstructorDecl
│   ├── MethodDecl
│   ├── ParameterDecl
│   └── EntrypointDecl
├── Statement
│   ├── InstantiateStmt
│   ├── RunStmt
│   ├── ForStmt
│   ├── ExitStmt
│   └── ReturnStmt
├── Expression
│   ├── IntegerLiteralExpr
│   ├── StringLiteralExpr
│   ├── BoolLiteralExpr
│   ├── IdentifierExpr
│   ├── ReferenceExpr
│   ├── MemberAccessExpr
│   ├── CallExpr
│   └── BinaryExpr
└── TypeRef`}</CodeBlock>

      <h3>Expression Precedence</h3>
      <CodeBlock language="text">{`Expression (lowest precedence)
├── Logical OR (||)
├── Logical AND (&&)
├── Equality (==, !=)
├── Comparison (<, >, <=, >=)
├── Addition (+, -)
├── Multiplication (*, /, %)
├── Unary (-, !, &)
└── Primary (literals, identifiers, calls)`}</CodeBlock>

      <h2>Phase 3: Semantic Analysis</h2>
      <p>
        The semantic analyzer validates the AST using a hierarchical symbol
        table and performs type checking.
      </p>

      <h3>Symbol Table Structure</h3>
      <CodeBlock language="text">{`Global Scope
├── Namespace: RenderStar
│   └── Namespace: Default
│       └── Class: MyClass
│           ├── Property: x (Integer^)
│           ├── Property: someString (String^)
│           ├── Constructor: default
│           └── Method: someMethod
│               ├── Parameter: int1 (Integer%)
│               └── Parameter: str (String&)
└── Entrypoint Scope
    ├── Variable: myClass
    ├── Variable: myString
    └── For Loop Scope
        └── Variable: x`}</CodeBlock>

      <h3>Semantic Checks</h3>
      <ol>
        <li>
          <strong>Name Resolution</strong> - Identifiers declared before use, no
          duplicates
        </li>
        <li>
          <strong>Type Checking</strong> - Variable initialization, argument
          types, return types
        </li>
        <li>
          <strong>Ownership Validation</strong> - Owned values not aliased,
          references point to valid owners
        </li>
        <li>
          <strong>Class Validation</strong> - Base classes exist, no circular
          inheritance
        </li>
        <li>
          <strong>Method Validation</strong> - Method exists, correct arguments
        </li>
      </ol>

      <h2>Phase 4: LLVM Code Generation</h2>

      <h3>Modular Codegen System</h3>
      <CodeBlock language="text">{`ModularCodegen (orchestrator)
├── ExprCodegen     - Expression code generation
│   ├── BinaryCodegen       - Binary operations (+, -, *, /, comparisons)
│   ├── CallCodegen         - Method/function calls
│   ├── IdentifierCodegen   - Variable references
│   ├── LiteralCodegen      - Integer, float, string, bool literals
│   └── MemberAccessCodegen - Property access, method resolution
├── StmtCodegen     - Statement code generation
│   ├── AssignmentCodegen   - Variable assignments
│   ├── ControlFlowCodegen  - If/else, while, for loops
│   └── ReturnCodegen       - Return statements
├── DeclCodegen     - Declaration code generation
│   ├── ClassCodegen        - Class structure generation
│   ├── ConstructorCodegen  - Constructor methods
│   ├── MethodCodegen       - Regular methods
│   ├── NativeMethodCodegen - FFI native methods
│   └── EntrypointCodegen   - Main function generation
├── FFICodegen      - Foreign function interface
├── MetadataGen     - Reflection metadata
├── PreambleGen     - Runtime preamble generation
└── TemplateGen     - Template instantiation`}</CodeBlock>

      <h3>Type-Safe LLVM IR</h3>
      <p>
        A compile-time type-safe abstraction prevents invalid IR generation:
      </p>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Component
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>TypedValue&lt;T&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Type-safe value wrappers (<code>IntValue</code>,{" "}
                <code>FloatValue</code>, <code>PtrValue</code>,{" "}
                <code>BoolValue</code>)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>AnyValue</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Runtime type variant when compile-time type is unknown
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>IRBuilder</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Type-safe instruction builder preventing invalid IR
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>TypedModule</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Module with type context and constant factories
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="info">
        Integer operations only accept/return <code>IntValue</code>, float
        operations return <code>FloatValue</code>, comparisons return{" "}
        <code>BoolValue</code>. The compiler catches type mismatches at
        compile-time.
      </Callout>

      <h3>Translation Examples</h3>

      <h4>Classes to Structs</h4>
      <CodeBlock language="xxml">{`[ Class <MyClass> Final Extends None
    [ Public <>
        Property <x> Types Integer^;
        Property <name> Types String^;
    ]
]`}</CodeBlock>
      <p>Becomes:</p>
      <CodeBlock language="llvm">{`%MyClass = type { ptr, ptr }  ; x, name as pointers`}</CodeBlock>

      <h4>Methods to Functions</h4>
      <CodeBlock language="xxml">{`Method <foo> Returns Integer^ Parameters (Parameter <x> Types Integer%) Do
{
    Return x.add(Integer::Constructor(1));
}`}</CodeBlock>
      <p>Becomes:</p>
      <CodeBlock language="llvm">{`define ptr @MyClass_foo(ptr %this, ptr %x) {
entry:
    ; ... method body
    ret ptr %result
}`}</CodeBlock>

      <h4>For Loops to Basic Blocks</h4>
      <CodeBlock language="xxml">{`For (Integer^ <i> = 0 .. 10) -> { ... }`}</CodeBlock>
      <p>Becomes:</p>
      <CodeBlock language="llvm">{`for.init:
    %i = alloca ptr
    store ptr %zero, ptr %i
    br label %for.cond
for.cond:
    %cmp = icmp slt i64 %i.val, 10
    br i1 %cmp, label %for.body, label %for.end
for.body:
    ; ... loop body
    br label %for.inc
for.inc:
    ; increment i
    br label %for.cond
for.end:
    ; continue after loop`}</CodeBlock>

      <h2>Runtime Integration</h2>
      <p>
        Compiled programs link against <code>libXXMLLLVMRuntime</code>:
      </p>
      <ul>
        <li>
          Memory management (<code>xxml_malloc</code>, <code>xxml_free</code>)
        </li>
        <li>Core types (Integer, String, Bool, Float, Double)</li>
        <li>
          Console I/O (<code>Console_printLine</code>, etc.)
        </li>
        <li>Reflection runtime for type introspection</li>
      </ul>

      <h2>Error Reporting</h2>
      <p>
        The <code>ErrorReporter</code> accumulates errors during compilation:
      </p>
      <CodeBlock language="text">{`filename.xxml:10:5: error: Undeclared identifier 'foo' [3000]
    Run System::Print(foo);
                      ^`}</CodeBlock>

      <h3>Error Categories</h3>
      <ul>
        <li>
          <strong>Lexer Errors:</strong> Unexpected character, unterminated
          string, invalid number
        </li>
        <li>
          <strong>Parser Errors:</strong> Unexpected token, missing delimiter,
          invalid syntax
        </li>
        <li>
          <strong>Semantic Errors:</strong> Undeclared identifier, type
          mismatch, duplicate declaration
        </li>
        <li>
          <strong>CodeGen Errors:</strong> Internal errors (should not occur)
        </li>
      </ul>

      <h2>Design Patterns</h2>

      <h3>Visitor Pattern</h3>
      <p>Used for AST traversal in semantic analysis and code generation:</p>
      <CodeBlock language="cpp">{`class ASTVisitor {
    virtual void visit(ClassDecl& node) = 0;
    virtual void visit(MethodDecl& node) = 0;
    // ...
};`}</CodeBlock>

      <h3>Builder Pattern</h3>
      <p>Used in Parser to construct AST nodes.</p>

      <h3>Strategy Pattern</h3>
      <p>
        Different code generation backends (LLVM Backend is current, Interpreter
        is future).
      </p>

      <h2>Performance</h2>

      <h3>Time Complexity</h3>
      <ul>
        <li>
          <strong>Lexing:</strong> O(n) where n = source size
        </li>
        <li>
          <strong>Parsing:</strong> O(n) where n = number of tokens
        </li>
        <li>
          <strong>Semantic Analysis:</strong> O(n * m) where n = nodes, m =
          average scope depth
        </li>
        <li>
          <strong>Code Generation:</strong> O(n) where n = AST nodes
        </li>
      </ul>

      <h3>Optimization Opportunities</h3>
      <ul>
        <li>
          <strong>String Interning:</strong> Reduce memory for repeated
          identifiers
        </li>
        <li>
          <strong>Arena Allocation:</strong> Faster AST node allocation
        </li>
        <li>
          <strong>Lazy Symbol Resolution:</strong> Delay expensive lookups
        </li>
        <li>
          <strong>Incremental Compilation:</strong> Recompile only changed
          modules
        </li>
      </ul>

      <h2>LLVM Optimizations</h2>
      <p>The LLVM backend leverages LLVM&apos;s optimization passes:</p>
      <ul>
        <li>Constant folding (also done at compile-time evaluation)</li>
        <li>Dead code elimination</li>
        <li>Inline expansion</li>
        <li>Common subexpression elimination</li>
      </ul>

      <h2>Future Enhancements</h2>
      <ul>
        <li>
          <strong>Interpreter:</strong> Direct AST interpretation for debugging
        </li>
        <li>
          <strong>JIT Compiler:</strong> Runtime compilation for dynamic
          scenarios
        </li>
        <li>
          <strong>Debug Information:</strong> DWARF debug info in generated
          binaries
        </li>
      </ul>

      <h2>Source Files</h2>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Component
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Location
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">Lexer</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <code>include/Lexer/</code>, <code>src/Lexer/</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Parser</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <code>include/Parser/</code>, <code>src/Parser/</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Semantic Analyzer</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <code>include/Semantic/</code>, <code>src/Semantic/</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">LLVM Backend</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <code>include/Backends/</code>, <code>src/Backends/</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Import Resolver</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <code>include/Import/</code>, <code>src/Import/</code>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Common Infrastructure</td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                <code>include/Common/</code>, <code>src/Common/</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Next Steps</h2>
      <p>
        Learn about the <a href="/docs/tools/cli">CLI Reference</a> for
        compilation options, or explore the{" "}
        <a href="/docs/tools/imports">Import System</a> for module resolution.
      </p>
    </>
  );
}
