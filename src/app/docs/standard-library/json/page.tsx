import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "JSON",
  description: "JSON parsing and generation in XXML",
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

export default function JSONPage() {
  return (
    <>
      <h1>JSON</h1>
      <p className="lead">
        JSON parsing and generation for data interchange. The <code>Format</code> module
        provides <code>JSONObject</code> and <code>JSONArray</code> classes for working
        with JSON data.
      </p>

      <CodeBlock language="xxml">{`#import Language::Core;
#import Language::Format;`}</CodeBlock>

      <ClassHeader name="JSONObject" description="Key-value object for JSON data." />

      <h3>Constructor</h3>
      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "JSONObject^", desc: "Create empty JSON object" },
        ]}
      />

      <h3>Object Operations</h3>
      <MethodTable
        methods={[
          { name: "set", params: "key: String^, value: String^", returns: "None", desc: "Set key to value" },
          { name: "get", params: "key: String^", returns: "String^", desc: "Get value or empty string" },
          { name: "has", params: "key: String^", returns: "Bool^", desc: "Check if key exists" },
          { name: "remove", params: "key: String^", returns: "None", desc: "Remove key" },
          { name: "size", params: "", returns: "Integer^", desc: "Number of pairs" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Format::JSONObject^ As <obj> = Format::JSONObject::Constructor();
Run obj.set(String::Constructor("name"), String::Constructor("Alice"));
Run obj.set(String::Constructor("city"), String::Constructor("Seattle"));

If (obj.has(String::Constructor("name"))) -> {
    Instantiate String^ As <name> = obj.get(String::Constructor("name"));
    Run Console::printLine(name);  // "Alice"
}`}</CodeBlock>

      <h3>Type-Specific Getters</h3>
      <MethodTable
        methods={[
          { name: "getInteger", params: "key: String^", returns: "Integer^", desc: "Parse value as integer" },
          { name: "getBool", params: "key: String^", returns: "Bool^", desc: "Parse value as boolean" },
        ]}
      />
      <CodeBlock language="xxml">{`Run obj.set(String::Constructor("age"), String::Constructor("25"));
Run obj.set(String::Constructor("active"), String::Constructor("true"));

Instantiate Integer^ As <age> = obj.getInteger(String::Constructor("age"));
Instantiate Bool^ As <active> = obj.getBool(String::Constructor("active"));`}</CodeBlock>

      <h3>Serialization</h3>
      <MethodTable
        methods={[
          { name: "stringify", params: "", returns: "String^", desc: "Convert to JSON string" },
        ]}
      />
      <CodeBlock language="xxml">{`Instantiate String^ As <json> = obj.stringify();
Run Console::printLine(json);  // {"name":"Alice","age":"25"}`}</CodeBlock>

      <ClassHeader name="JSONArray" description="Ordered array of JSON values." />

      <h3>Constructor</h3>
      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "JSONArray^", desc: "Create empty JSON array" },
        ]}
      />

      <h3>Array Operations</h3>
      <MethodTable
        methods={[
          { name: "add", params: "value: String^", returns: "None", desc: "Add to end" },
          { name: "get", params: "index: Integer^", returns: "String^", desc: "Get value at index" },
          { name: "remove", params: "index: Integer^", returns: "None", desc: "Remove at index" },
          { name: "size", params: "", returns: "Integer^", desc: "Number of elements" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Format::JSONArray^ As <arr> = Format::JSONArray::Constructor();
Run arr.add(String::Constructor("first"));
Run arr.add(String::Constructor("second"));

Instantiate String^ As <first> = arr.get(Integer::Constructor(0));
Run Console::printLine(first);  // "first"`}</CodeBlock>

      <h3>Serialization</h3>
      <MethodTable
        methods={[
          { name: "stringify", params: "", returns: "String^", desc: "Convert to JSON string" },
        ]}
      />
      <CodeBlock language="xxml">{`Instantiate String^ As <json> = arr.stringify();
Run Console::printLine(json);  // ["first","second"]`}</CodeBlock>

      <Callout type="info">
        All values in JSONObject and JSONArray are stored as strings. Use type-specific
        getters (<code>getInteger</code>, <code>getBool</code>) for automatic parsing.
      </Callout>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="json_example.xxml" showLineNumbers>{`#import Language::Core;
#import Language::Format;
#import Language::System;

[ Entrypoint
    {
        // Build a JSON object
        Instantiate Format::JSONObject^ As <person> = Format::JSONObject::Constructor();
        Run person.set(String::Constructor("name"), String::Constructor("Alice"));
        Run person.set(String::Constructor("age"), String::Constructor("30"));
        Run person.set(String::Constructor("active"), String::Constructor("true"));

        // Output as JSON
        Run Console::printLine(String::Constructor("Person JSON:"));
        Run Console::printLine(person.stringify());

        // Read values back
        Instantiate String^ As <name> = person.get(String::Constructor("name"));
        Instantiate Integer^ As <age> = person.getInteger(String::Constructor("age"));
        Instantiate Bool^ As <active> = person.getBool(String::Constructor("active"));

        Run Console::printLine(String::Constructor("Name: ").append(name));
        Run Console::printLine(String::Constructor("Age: ").append(age.toString()));

        // Build a JSON array
        Instantiate Format::JSONArray^ As <items> = Format::JSONArray::Constructor();
        Run items.add(String::Constructor("apple"));
        Run items.add(String::Constructor("banana"));
        Run items.add(String::Constructor("cherry"));

        Run Console::printLine(String::Constructor("Items JSON:"));
        Run Console::printLine(items.stringify());

        Exit(0);
    }
]`}</CodeBlock>

      <h2>See Also</h2>
      <div className="not-prose mt-4 flex flex-wrap gap-2">
        <a href="/docs/standard-library/http" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          HTTP
        </a>
        <a href="/docs/standard-library/core" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Core Types
        </a>
      </div>
    </>
  );
}
