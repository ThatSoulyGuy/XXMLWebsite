import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Derives",
  description: "Automatic method generation in XXML",
};

export default function DerivesPage() {
  return (
    <>
      <h1>Derives</h1>
      <p className="lead">
        The derive system allows automatic generation of common methods like{" "}
        <code>equals()</code>, <code>hash()</code>, and <code>toString()</code>{" "}
        based on class structure.
      </p>

      <h2>Basic Usage</h2>
      <CodeBlock language="xxml">{`@Derive(trait = "Stringable")
@Derive(trait = "Equatable")
@Derive(trait = "Hashable")
[ Class <Point> Final Extends None
    [ Public <>
        Property <x> Types Integer^;
        Property <y> Types Integer^;
        Constructor = default;
    ]
]`}</CodeBlock>

      <p>The compiler generates:</p>
      <ul>
        <li>
          <code>toString()</code> - Returns{" "}
          <code>&quot;Point&#123;x=&lt;value&gt;, y=&lt;value&gt;&#125;&quot;</code>
        </li>
        <li>
          <code>equals(Point&amp;)</code> - Compares all public properties
        </li>
        <li>
          <code>hash()</code> - Computes a hash code from all public properties
        </li>
      </ul>

      <h2>Built-in Derives</h2>

      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Derive
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Generated Method
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Stringable</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <code>toString()</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Human-readable representation
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Equatable</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <code>equals(T&amp;)</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Structural equality comparison
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Hashable</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <code>hash()</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Hash code computation
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Sendable</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <em>Marker</em>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Safe to move across thread boundaries
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Sharable</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <em>Marker</em>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Safe to share across threads
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>JSON</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <code>toJSON()</code>, <code>fromJSON()</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                JSON serialization
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Derive&lt;Stringable&gt;</h2>
      <CodeBlock language="xxml">{`@Derive(trait = "Stringable")
[ Class <Person> Final Extends None
    [ Public <>
        Property <name> Types String^;
        Property <age> Types Integer^;
        Constructor = default;
    ]
]

// Generated toString() returns: "Person{name=John, age=30}"`}</CodeBlock>

      <h2>Derive&lt;Equatable&gt;</h2>
      <CodeBlock language="xxml">{`@Derive(trait = "Equatable")
[ Class <Point> Final Extends None
    [ Public <>
        Property <x> Types Integer^;
        Property <y> Types Integer^;
        Constructor = default;
    ]
]

// Usage:
Instantiate Point^ As <p1> = Point::Constructor();
Instantiate Point^ As <p2> = Point::Constructor();
Instantiate Bool^ As <areEqual> = p1.equals(p2);`}</CodeBlock>

      <h2>Derive&lt;JSON&gt;</h2>
      <CodeBlock language="xxml">{`#import Language::Format;

@Derive(trait = "JSON")
[ Class <Person> Final Extends None
    [ Public <>
        Property <name> Types String^;
        Property <age> Types Integer^;
        Constructor = default;
    ]
]

// Serialize to JSON
Instantiate Person^ As <p> = Person::Constructor();
Set p.name = String::Constructor("Alice");
Set p.age = Integer::Constructor(30);
Instantiate JSONObject^ As <json> = p.toJSON();
// json = {"name": "Alice", "age": 30}

// Deserialize from JSON
Instantiate JSONObject^ As <input> = JSONObject::parse(...);
Instantiate Person^ As <p2> = Person::fromJSON(input);`}</CodeBlock>

      <h2>Thread Safety: Sendable &amp; Sharable</h2>
      <CodeBlock language="xxml">{`// Sendable: safe to move across threads
@Derive(trait = "Sendable")
[ Class <Message> Final Extends None
    [ Public <>
        Property <id> Types Integer^;
        Property <content> Types String^;
        Constructor = default;
    ]
]

// Sharable: safe to share (reference) across threads
@Derive(trait = "Sharable")
[ Class <Config> Final Extends None
    [ Public <>
        Property <maxConnections> Types Integer^;

        // Immutable after construction
        Constructor Parameters (Parameter <max> Types Integer^) -> {
            Set maxConnections = max;
        }
    ]
]`}</CodeBlock>

      <Callout type="warning">
        <code>Sendable</code> types cannot have reference (<code>&amp;</code>)
        fields. <code>Sharable</code> types should be immutable after
        construction.
      </Callout>

      <h2>Property Requirements</h2>
      <p>
        Derives only consider <strong>public properties</strong>. Private
        properties are ignored:
      </p>
      <CodeBlock language="xxml">{`@Derive(trait = "Equatable")
[ Class <Account> Final Extends None
    [ Private <>
        Property <internalId> Types Integer^;  // Ignored
    ]

    [ Public <>
        Property <accountNumber> Types String^;  // Used
        Constructor = default;
    ]
]`}</CodeBlock>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="data-class.xxml">{`#import Language::Core;

@Derive(trait = "Equatable")
@Derive(trait = "Hashable")
@Derive(trait = "Stringable")
[ Class <Product> Final Extends None
    [ Public <>
        Property <id> Types Integer^;
        Property <name> Types String^;
        Property <price> Types Integer^;

        Constructor = default;
    ]
]

[ Entrypoint {
    Instantiate Product^ As <p1> = Product::Constructor();
    Set p1.id = Integer::Constructor(1);
    Set p1.name = String::Constructor("Widget");
    Set p1.price = Integer::Constructor(100);

    Instantiate Product^ As <p2> = Product::Constructor();
    Set p2.id = Integer::Constructor(1);
    Set p2.name = String::Constructor("Widget");
    Set p2.price = Integer::Constructor(100);

    // Test equality
    If (p1.equals(p2)) -> {
        Run Console::printLine(String::Constructor("Products are equal"));
    }

    // Test toString
    Run Console::printLine(p1.toString());
    // Output: Product{id=1, name=Widget, price=100}

    Exit(0);
}]`}</CodeBlock>

      <h2>Next Steps</h2>
      <p>
        Learn about{" "}
        <a href="/docs/advanced/annotations">Annotations</a> for custom metadata,
        or explore{" "}
        <a href="/docs/advanced/threading">Threading</a> to understand Sendable
        and Sharable constraints.
      </p>
    </>
  );
}
