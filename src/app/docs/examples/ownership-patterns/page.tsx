import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Ownership Patterns",
  description: "Common patterns for XXML ownership semantics",
};

export default function OwnershipPatternsPage() {
  return (
    <>
      <h1>Ownership Patterns</h1>
      <p className="lead">
        Learn common patterns for working with XXML&apos;s ownership system
        using <code>^</code> (owned), <code>&amp;</code> (reference), and <code>%</code> (copy).
      </p>

      <div className="not-prose my-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <code className="text-lg font-semibold text-blue-700 dark:text-blue-300">^</code>
          <p className="mt-1 text-sm font-medium text-blue-800 dark:text-blue-200">Owned</p>
          <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">Full ownership, responsible for cleanup</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <code className="text-lg font-semibold text-green-700 dark:text-green-300">&amp;</code>
          <p className="mt-1 text-sm font-medium text-green-800 dark:text-green-200">Reference</p>
          <p className="mt-1 text-xs text-green-700 dark:text-green-300">Borrowed access, no ownership</p>
        </div>
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <code className="text-lg font-semibold text-purple-700 dark:text-purple-300">%</code>
          <p className="mt-1 text-sm font-medium text-purple-800 dark:text-purple-200">Copy</p>
          <p className="mt-1 text-xs text-purple-700 dark:text-purple-300">Independent copy of the value</p>
        </div>
      </div>

      <h2>Pattern 1: Builder Pattern</h2>
      <p>
        The builder pattern works well with ownership. Each method returns a reference
        to allow chaining, while the final <code>build</code> method returns an owned value.
      </p>

      <CodeBlock language="xxml" filename="builder_pattern.xxml" showLineNumbers>{`[ Class <PersonBuilder> Final Extends None
    [ Private <>
        Property <name> Types String^;
        Property <age> Types Integer^;
        Property <email> Types String^;
    ]

    [ Public <>
        Constructor Parameters () ->
        {
            Set name = String::Constructor("");
            Set age = Integer::Constructor(0);
            Set email = String::Constructor("");
        }

        Method <withName> Returns PersonBuilder& Parameters (Parameter <n> Types String^) Do
        {
            Set name = n;
            Return &self;
        }

        Method <withAge> Returns PersonBuilder& Parameters (Parameter <a> Types Integer%) Do
        {
            Set age = a;
            Return &self;
        }

        Method <withEmail> Returns PersonBuilder& Parameters (Parameter <e> Types String^) Do
        {
            Set email = e;
            Return &self;
        }

        Method <build> Returns Person^ Parameters () Do
        {
            Return Person::Constructor(name, age, email);
        }
    ]
]

// Usage
Instantiate PersonBuilder^ As <builder> = PersonBuilder::Constructor();
Instantiate Person^ As <person> = builder
    .withName(String::Constructor("Alice"))
    .withAge(Integer::Constructor(30))
    .withEmail(String::Constructor("alice@example.com"))
    .build();`}</CodeBlock>

      <Callout type="tip">
        Builder methods return <code>&amp;self</code> to enable method chaining while
        keeping the builder alive. The final <code>build()</code> returns an owned <code>^</code> value.
      </Callout>

      <h2>Pattern 2: Container with Borrowed Access</h2>
      <p>
        Containers own their data but provide borrowed references for access.
        This prevents copying while maintaining safety.
      </p>

      <CodeBlock language="xxml" filename="container_pattern.xxml" showLineNumbers>{`[ Class <Cache> <K Constrains None, V Constrains None> Final Extends None
    [ Private <>
        Property <data> Types Collections::HashMap<K, V>^;
    ]

    [ Public <>
        Constructor Parameters () ->
        {
            Set data = Collections::HashMap@K, V::Constructor();
        }

        // Takes ownership of both key and value
        Method <put> Returns None Parameters (
            Parameter <key> Types K^,
            Parameter <value> Types V^
        ) Do
        {
            Run data.put(key, value);
        }

        // Returns borrowed reference - doesn't transfer ownership
        Method <get> Returns V& Parameters (Parameter <key> Types K&) Do
        {
            Return data.get(key);
        }

        // Check without borrowing
        Method <contains> Returns Bool^ Parameters (Parameter <key> Types K&) Do
        {
            Return data.contains(key);
        }
    ]
]

// Usage - cache owns all data
Instantiate Cache<String, String>^ As <cache> = Cache@String, String::Constructor();

Run cache.put(String::Constructor("key1"), String::Constructor("value1"));

// Get returns a reference, doesn't copy
Instantiate String& As <value> = cache.get(String::Constructor("key1"));
Run Console::printLine(value);`}</CodeBlock>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Operation
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Ownership Behavior
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3"><code>put(K^, V^)</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Takes ownership of key and value</td>
            </tr>
            <tr>
              <td className="px-4 py-3"><code>get(K&)</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Borrows key, returns borrowed value</td>
            </tr>
            <tr>
              <td className="px-4 py-3"><code>contains(K&)</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Borrows key, returns new Bool</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Pattern 3: Processing Pipeline with Copies</h2>
      <p>
        When you need to process data without modifying the original,
        use copy parameters.
      </p>

      <CodeBlock language="xxml" filename="pipeline_pattern.xxml" showLineNumbers>{`[ Class <StringProcessor> Final Extends None
    [ Public <>
        Constructor = default;

        // Takes a copy - doesn't affect original
        Method <process> Returns String^ Parameters (Parameter <input> Types String%) Do
        {
            Instantiate String^ As <result> = input.toUpperCase();
            Set result = result.trim();
            Return result;
        }
    ]
]

// Original is unchanged
Instantiate String^ As <original> = String::Constructor("  hello world  ");
Instantiate StringProcessor^ As <processor> = StringProcessor::Constructor();

Instantiate String^ As <processed> = processor.process(original);

Run Console::printLine(original);    // "  hello world  "
Run Console::printLine(processed);   // "HELLO WORLD"`}</CodeBlock>

      <Callout type="info">
        Using <code>String%</code> creates a copy of the input, ensuring the original
        string remains unchanged after processing.
      </Callout>

      <h2>Pattern 4: Factory Pattern</h2>
      <p>
        Factory methods return owned values since they create new objects.
      </p>

      <CodeBlock language="xxml" filename="factory_pattern.xxml" showLineNumbers>{`[ Class <ConnectionFactory> Final Extends None
    [ Private <>
        Property <host> Types String^;
        Property <port> Types Integer^;
    ]

    [ Public <>
        Constructor Parameters (
            Parameter <h> Types String^,
            Parameter <p> Types Integer%
        ) ->
        {
            Set host = h;
            Set port = p;
        }

        // Factory method returns owned connection
        Method <create> Returns Connection^ Parameters () Do
        {
            Return Connection::Constructor(host, port);
        }

        // Create with custom timeout
        Method <createWithTimeout> Returns Connection^ Parameters (
            Parameter <timeout> Types Integer%
        ) Do
        {
            Instantiate Connection^ As <conn> = Connection::Constructor(host, port);
            Run conn.setTimeout(timeout);
            Return conn;
        }
    ]
]

// Each call creates a new owned connection
Instantiate ConnectionFactory^ As <factory> = ConnectionFactory::Constructor(
    String::Constructor("localhost"),
    Integer::Constructor(8080)
);

Instantiate Connection^ As <conn1> = factory.create();
Instantiate Connection^ As <conn2> = factory.createWithTimeout(Integer::Constructor(5000));`}</CodeBlock>

      <Callout type="tip">
        Factory methods always return <code>^</code> (owned) because they create new objects
        that the caller should own and manage.
      </Callout>

      <h2>Pattern 5: Callback with Reference</h2>
      <p>
        When passing lambdas that capture data, choose the right capture mode.
      </p>

      <CodeBlock language="xxml" filename="callback_pattern.xxml" showLineNumbers>{`[ Class <EventEmitter> Final Extends None
    [ Private <>
        Property <handlers> Types Collections::List<F(None)(String&)>^;
    ]

    [ Public <>
        Constructor Parameters () ->
        {
            Set handlers = Collections::List@F(None)(String&)::Constructor();
        }

        Method <on> Returns None Parameters (
            Parameter <handler> Types F(None)(String&)^
        ) Do
        {
            Run handlers.add(handler);
        }

        Method <emit> Returns None Parameters (Parameter <event> Types String&) Do
        {
            For (Integer^ <i> = 0 .. handlers.size()) ->
            {
                Instantiate F(None)(String&)& As <handler> = handlers.get(i);
                Run handler.call(event);
            }
        }
    ]
]

// Usage with different capture modes
Instantiate EventEmitter^ As <emitter> = EventEmitter::Constructor();

// Copy capture - prefix is copied into lambda
Instantiate String^ As <prefix> = String::Constructor("[LOG]");

Instantiate F(None)(String&)^ As <logger> = [ Lambda [%prefix] Returns None Parameters (
    Parameter <msg> Types String&
) {
    Run Console::printLine(prefix.concat(String::Constructor(" ")).concat(msg));
}];

Run emitter.on(logger);
Run emitter.emit(String::Constructor("Application started"));`}</CodeBlock>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Capture Mode
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                When to Use
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3"><code>[%var]</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Lambda outlives the original variable</td>
            </tr>
            <tr>
              <td className="px-4 py-3"><code>[&amp;var]</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Short-lived lambda, original stays in scope</td>
            </tr>
            <tr>
              <td className="px-4 py-3"><code>[^var]</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Transfer ownership to the lambda</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Pattern 6: RAII - Resource Acquisition</h2>
      <p>
        Ownership ensures resources are released when they go out of scope.
      </p>

      <CodeBlock language="xxml" filename="raii_pattern.xxml" showLineNumbers>{`[ Class <FileHandle> Final Extends None
    [ Private <>
        Property <file> Types IO::File^;
        Property <path> Types String^;
    ]

    [ Public <>
        Constructor Parameters (Parameter <filePath> Types String^) ->
        {
            Set path = filePath;
            Set file = IO::File::Constructor(filePath, String::Constructor("r"));
        }

        // File is automatically closed when FileHandle is destroyed

        Method <readAll> Returns String^ Parameters () Do
        {
            Return IO::File::readAll(path);
        }
    ]
]

// Usage - file is automatically closed when handle goes out of scope
{
    Instantiate FileHandle^ As <handle> = FileHandle::Constructor(
        String::Constructor("data.txt")
    );
    Instantiate String^ As <content> = handle.readAll();
    Run Console::printLine(content);
}  // handle goes out of scope, file is closed`}</CodeBlock>

      <Callout type="info">
        <strong>RAII</strong> (Resource Acquisition Is Initialization) ensures resources like
        files, connections, and locks are automatically cleaned up when their owner goes out of scope.
      </Callout>

      <h2>Pattern 7: Option Type</h2>
      <p>
        Represent optional values safely with ownership.
      </p>

      <CodeBlock language="xxml" filename="option_pattern.xxml" showLineNumbers>{`[ Class <Option> <T Constrains None> Final Extends None
    [ Private <>
        Property <value> Types T^;
        Property <hasValue> Types Bool^;
    ]

    [ Public <>
        // Create empty option
        Constructor Parameters () ->
        {
            Set hasValue = Bool::Constructor(false);
        }

        // Create option with value
        Constructor Parameters (Parameter <v> Types T^) ->
        {
            Set value = v;
            Set hasValue = Bool::Constructor(true);
        }

        Method <isSome> Returns Bool^ Parameters () Do
        {
            Return hasValue;
        }

        Method <isNone> Returns Bool^ Parameters () Do
        {
            Return hasValue.not();
        }

        // Returns reference - caller doesn't take ownership
        Method <unwrap> Returns T& Parameters () Do
        {
            Return &value;
        }

        // Returns owned value with default
        Method <unwrapOr> Returns T^ Parameters (Parameter <default> Types T^) Do
        {
            If (hasValue) -> {
                Return value;
            } Else -> {
                Return default;
            }
        }
    ]
]

// Usage
Method <findUser> Returns Option<User>^ Parameters (Parameter <id> Types Integer%) Do
{
    If (userExists(id)) -> {
        Return Option@User::Constructor(loadUser(id));
    } Else -> {
        Return Option@User::Constructor();
    }
}

Instantiate Option<User>^ As <maybeUser> = findUser(Integer::Constructor(123));

If (maybeUser.isSome()) -> {
    Instantiate User& As <user> = maybeUser.unwrap();
    Run Console::printLine(user.name);
}`}</CodeBlock>

      <h2>Best Practices Summary</h2>

      <div className="not-prose my-6 space-y-4">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">When to Return <code>^</code> (Owned)</h3>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
            Factory methods, constructors, and any method creating new values.
            The caller becomes responsible for the object&apos;s lifetime.
          </p>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <h3 className="text-sm font-semibold text-green-800 dark:text-green-200">When to Return <code>&amp;</code> (Reference)</h3>
          <p className="mt-1 text-sm text-green-700 dark:text-green-300">
            Getters, accessors, and methods providing access to internal data.
            The original owner retains control and cleanup responsibility.
          </p>
        </div>

        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200">When to Accept <code>%</code> (Copy)</h3>
          <p className="mt-1 text-sm text-purple-700 dark:text-purple-300">
            Small primitive values, when you need independence from the original,
            or when the function should not affect the caller&apos;s data.
          </p>
        </div>
      </div>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Scenario
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Recommended
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Why
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">Creating new values</td>
              <td className="px-4 py-3"><code>Return T^</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Caller owns the new object</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Accessing internal data</td>
              <td className="px-4 py-3"><code>Return T&</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">No ownership transfer needed</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Small values (int, bool)</td>
              <td className="px-4 py-3"><code>Parameter T%</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Copy is cheap</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Read-only large data</td>
              <td className="px-4 py-3"><code>Parameter T&</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Avoid expensive copies</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Taking ownership</td>
              <td className="px-4 py-3"><code>Parameter T^</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Clear ownership transfer</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Lambda captures (long-lived)</td>
              <td className="px-4 py-3"><code>[%var]</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Lambda needs its own copy</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Lambda captures (short-lived)</td>
              <td className="px-4 py-3"><code>[&var]</code></td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">Reference is sufficient</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="warning">
        When in doubt, prefer <code>&amp;</code> (reference) for parameters to avoid
        unnecessary copies or ownership transfers. Only use <code>^</code> when you
        truly need to take ownership.
      </Callout>

      <h2>Next Steps</h2>
      <p>
        Now that you understand ownership patterns, explore the{" "}
        <a href="/docs/language-reference/ownership">ownership reference</a> for
        detailed semantics, or check out the{" "}
        <a href="/docs/standard-library/collections">Collections module</a> to see
        ownership in action with data structures.
      </p>
    </>
  );
}
