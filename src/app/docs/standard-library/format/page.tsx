import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Format Module",
  description: "XXML Language::Format module reference",
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

export default function FormatPage() {
  return (
    <>
      <h1>Format Module</h1>
      <p className="lead">
        The <code>Language::Format</code> module provides JSON parsing and
        serialization for data interchange.
      </p>

      <CodeBlock language="xxml">{`#import Language::Format;`}</CodeBlock>

      <div className="not-prose my-8 grid gap-2 sm:grid-cols-2">
        {["JSONObject", "JSONArray"].map((cls) => (
          <a
            key={cls}
            href={`#${cls.toLowerCase()}`}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-center text-sm font-medium text-zinc-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300"
          >
            {cls}
          </a>
        ))}
      </div>

      <ClassHeader name="JSONObject" description="Represents a JSON object with key-value pairs." />

      <h3>Creating Objects</h3>
      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "JSONObject^", desc: "Create empty object" },
          { name: "parse", params: "json: String^", returns: "JSONObject^", desc: "Parse JSON string (static)" },
        ]}
      />

      <CodeBlock language="xxml">{`// Create empty object and add properties
Instantiate Format::JSONObject^ As <obj> = Format::JSONObject::Constructor();
Run obj.put(String::Constructor("name"), String::Constructor("Alice"));
Run obj.put(String::Constructor("age"), Integer::Constructor(30));

// Parse from JSON string
Instantiate Format::JSONObject^ As <parsed> = Format::JSONObject::parse(
    String::Constructor("{\\"name\\": \\"Bob\\", \\"active\\": true}")
);`}</CodeBlock>

      <h3>Adding Values</h3>
      <MethodTable
        methods={[
          { name: "put", params: "key: String^, value: String^", returns: "None", desc: "Add string value" },
          { name: "put", params: "key: String^, value: Integer^", returns: "None", desc: "Add integer value" },
          { name: "put", params: "key: String^, value: Double^", returns: "None", desc: "Add double value" },
          { name: "put", params: "key: String^, value: Bool^", returns: "None", desc: "Add boolean value" },
          { name: "put", params: "key: String^, value: JSONObject^", returns: "None", desc: "Add nested object" },
          { name: "put", params: "key: String^, value: JSONArray^", returns: "None", desc: "Add array value" },
        ]}
      />

      <h3>Reading Values</h3>
      <MethodTable
        methods={[
          { name: "get", params: "key: String^", returns: "String^", desc: "Get as string" },
          { name: "getString", params: "key: String^", returns: "String^", desc: "Get string value" },
          { name: "getInt", params: "key: String^", returns: "Integer^", desc: "Get integer value" },
          { name: "getDouble", params: "key: String^", returns: "Double^", desc: "Get double value" },
          { name: "getBool", params: "key: String^", returns: "Bool^", desc: "Get boolean value" },
          { name: "getObject", params: "key: String^", returns: "JSONObject^", desc: "Get nested object" },
          { name: "getArray", params: "key: String^", returns: "JSONArray^", desc: "Get array value" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Format::JSONObject^ As <user> = Format::JSONObject::parse(
    String::Constructor("{\\"name\\": \\"Alice\\", \\"age\\": 30, \\"premium\\": true}")
);

Instantiate String^ As <name> = user.getString(String::Constructor("name"));
Instantiate Integer^ As <age> = user.getInt(String::Constructor("age"));
Instantiate Bool^ As <isPremium> = user.getBool(String::Constructor("premium"));

Run System::Console::printLine(name);  // Alice
Run System::Console::printLine(age.toString());  // 30`}</CodeBlock>

      <h3>Object Operations</h3>
      <MethodTable
        methods={[
          { name: "has", params: "key: String^", returns: "Bool^", desc: "Check if key exists" },
          { name: "remove", params: "key: String^", returns: "None", desc: "Remove key-value pair" },
          { name: "keys", params: "", returns: "List<String>^", desc: "Get all keys" },
          { name: "size", params: "", returns: "Integer^", desc: "Get number of keys" },
        ]}
      />

      <h3>Serialization</h3>
      <MethodTable
        methods={[
          { name: "toString", params: "", returns: "String^", desc: "Compact JSON string" },
          { name: "toStringPretty", params: "", returns: "String^", desc: "Formatted JSON string" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Format::JSONObject^ As <config> = Format::JSONObject::Constructor();
Run config.put(String::Constructor("debug"), Bool::Constructor(true));
Run config.put(String::Constructor("maxRetries"), Integer::Constructor(3));
Run config.put(String::Constructor("timeout"), Double::Constructor(30.5));

// Compact output
Instantiate String^ As <compact> = config.toString();
// {"debug":true,"maxRetries":3,"timeout":30.5}

// Pretty printed
Instantiate String^ As <pretty> = config.toStringPretty();
// {
//   "debug": true,
//   "maxRetries": 3,
//   "timeout": 30.5
// }`}</CodeBlock>

      <ClassHeader name="JSONArray" description="Represents a JSON array of values." />

      <h3>Creating Arrays</h3>
      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "JSONArray^", desc: "Create empty array" },
          { name: "parse", params: "json: String^", returns: "JSONArray^", desc: "Parse JSON array string (static)" },
        ]}
      />

      <h3>Adding Values</h3>
      <MethodTable
        methods={[
          { name: "add", params: "value: String^", returns: "None", desc: "Add string" },
          { name: "add", params: "value: Integer^", returns: "None", desc: "Add integer" },
          { name: "add", params: "value: Double^", returns: "None", desc: "Add double" },
          { name: "add", params: "value: Bool^", returns: "None", desc: "Add boolean" },
          { name: "add", params: "value: JSONObject^", returns: "None", desc: "Add object" },
          { name: "add", params: "value: JSONArray^", returns: "None", desc: "Add nested array" },
        ]}
      />

      <h3>Reading Values</h3>
      <MethodTable
        methods={[
          { name: "get", params: "index: Integer^", returns: "String^", desc: "Get as string" },
          { name: "getString", params: "index: Integer^", returns: "String^", desc: "Get string at index" },
          { name: "getInt", params: "index: Integer^", returns: "Integer^", desc: "Get integer at index" },
          { name: "getDouble", params: "index: Integer^", returns: "Double^", desc: "Get double at index" },
          { name: "getBool", params: "index: Integer^", returns: "Bool^", desc: "Get boolean at index" },
          { name: "getObject", params: "index: Integer^", returns: "JSONObject^", desc: "Get object at index" },
          { name: "getArray", params: "index: Integer^", returns: "JSONArray^", desc: "Get array at index" },
        ]}
      />

      <h3>Array Operations</h3>
      <MethodTable
        methods={[
          { name: "set", params: "index: Integer^, value: ...", returns: "None", desc: "Replace value at index" },
          { name: "remove", params: "index: Integer^", returns: "None", desc: "Remove value at index" },
          { name: "size", params: "", returns: "Integer^", desc: "Get array length" },
          { name: "toString", params: "", returns: "String^", desc: "Compact JSON string" },
          { name: "toStringPretty", params: "", returns: "String^", desc: "Formatted JSON string" },
        ]}
      />

      <CodeBlock language="xxml">{`// Create array of strings
Instantiate Format::JSONArray^ As <tags> = Format::JSONArray::Constructor();
Run tags.add(String::Constructor("xxml"));
Run tags.add(String::Constructor("programming"));
Run tags.add(String::Constructor("compiler"));

// Parse JSON array
Instantiate Format::JSONArray^ As <numbers> = Format::JSONArray::parse(
    String::Constructor("[1, 2, 3, 4, 5]")
);

// Iterate over array
For (Instantiate Integer^ As <i> = Integer::Constructor(0);
     i.lessThan(numbers.size()).toBool();
     Set i = i.add(Integer::Constructor(1)))
{
    Instantiate Integer^ As <num> = numbers.getInt(i);
    Run System::Console::printLine(num.toString());
}`}</CodeBlock>

      <Callout type="info">
        JSONObject and JSONArray can be nested to create complex data structures.
        Use <code>toStringPretty()</code> for human-readable output during debugging.
      </Callout>

      <h2>Nested Structures</h2>
      <CodeBlock language="xxml">{`// Build a complex JSON structure
Instantiate Format::JSONObject^ As <user> = Format::JSONObject::Constructor();
Run user.put(String::Constructor("id"), Integer::Constructor(123));
Run user.put(String::Constructor("name"), String::Constructor("Alice"));

// Add nested object
Instantiate Format::JSONObject^ As <address> = Format::JSONObject::Constructor();
Run address.put(String::Constructor("city"), String::Constructor("New York"));
Run address.put(String::Constructor("zip"), String::Constructor("10001"));
Run user.put(String::Constructor("address"), address);

// Add array
Instantiate Format::JSONArray^ As <roles> = Format::JSONArray::Constructor();
Run roles.add(String::Constructor("admin"));
Run roles.add(String::Constructor("user"));
Run user.put(String::Constructor("roles"), roles);

Run System::Console::printLine(user.toStringPretty());
// {
//   "id": 123,
//   "name": "Alice",
//   "address": {
//     "city": "New York",
//     "zip": "10001"
//   },
//   "roles": ["admin", "user"]
// }`}</CodeBlock>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="json_demo.xxml" showLineNumbers>{`#import Language::Core;
#import Language::Format;
#import Language::Collections;
#import Language::System;

[ Entrypoint
    {
        // Create a configuration object
        Instantiate Format::JSONObject^ As <config> = Format::JSONObject::Constructor();

        // App settings
        Run config.put(String::Constructor("appName"), String::Constructor("MyApp"));
        Run config.put(String::Constructor("version"), String::Constructor("1.0.0"));
        Run config.put(String::Constructor("debug"), Bool::Constructor(true));

        // Database config
        Instantiate Format::JSONObject^ As <database> = Format::JSONObject::Constructor();
        Run database.put(String::Constructor("host"), String::Constructor("localhost"));
        Run database.put(String::Constructor("port"), Integer::Constructor(5432));
        Run database.put(String::Constructor("name"), String::Constructor("myapp_db"));
        Run config.put(String::Constructor("database"), database);

        // Feature flags
        Instantiate Format::JSONArray^ As <features> = Format::JSONArray::Constructor();
        Run features.add(String::Constructor("dark_mode"));
        Run features.add(String::Constructor("notifications"));
        Run features.add(String::Constructor("analytics"));
        Run config.put(String::Constructor("features"), features);

        // Output configuration
        Run System::Console::printLine(String::Constructor("=== Configuration ==="));
        Run System::Console::printLine(config.toStringPretty());

        // Parse and read JSON
        Run System::Console::printLine(String::Constructor(""));
        Run System::Console::printLine(String::Constructor("=== Reading Values ==="));

        Instantiate String^ As <appName> = config.getString(String::Constructor("appName"));
        Run System::Console::printLine(String::Constructor("App: ").append(appName));

        Instantiate Format::JSONObject^ As <db> = config.getObject(String::Constructor("database"));
        Instantiate Integer^ As <port> = db.getInt(String::Constructor("port"));
        Run System::Console::printLine(String::Constructor("DB Port: ").append(port.toString()));

        // Check feature flags
        Instantiate Format::JSONArray^ As <flags> = config.getArray(String::Constructor("features"));
        Run System::Console::printLine(
            String::Constructor("Features enabled: ").append(flags.size().toString())
        );

        Exit(0);
    }
]`}</CodeBlock>

      <h2>See Also</h2>
      <div className="not-prose mt-4 flex flex-wrap gap-2">
        <a href="/docs/standard-library/text" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Text Module
        </a>
        <a href="/docs/standard-library/network" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Network Module
        </a>
      </div>
    </>
  );
}
