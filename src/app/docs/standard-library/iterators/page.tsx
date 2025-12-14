import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Iterators",
  description: "Iterator types for traversing collections in XXML",
};

function ClassHeader({ name, description }: { name: string; description: string }) {
  return (
    <div className="not-prose mb-6 rounded-lg border border-zinc-200 bg-gradient-to-r from-zinc-50 to-white p-4 dark:border-zinc-700 dark:from-zinc-800/50 dark:to-zinc-900">
      <h2 className="m-0 text-xl font-bold text-zinc-900 dark:text-zinc-100" id={name.toLowerCase().replace(/[<>,\s]/g, "-")}>
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

export default function IteratorsPage() {
  return (
    <>
      <h1>Iterators</h1>
      <p className="lead">
        Iterator types for traversing collections. The standard library provides iterators
        for List, Set, and HashMap with varying capabilities.
      </p>

      <CodeBlock language="xxml">{`#import Language::Core;
#import Language::Collections;`}</CodeBlock>

      <h2>Iterator Constraints</h2>
      <p>The standard library defines iterator contracts through constraints:</p>

      <h3>Forward Iterator</h3>
      <p>Minimum requirement for iteration:</p>
      <CodeBlock language="xxml">{`[ Constraint <Iterator> <T Constrains None, Element Constrains None> (T iter)
    Require (F(Bool^)(hasNext)(*) On iter)
    Require (F(Element^)(next)(*) On iter)
    Require (F(Element^)(current)(*) On iter)
]`}</CodeBlock>

      <h3>Bidirectional Iterator</h3>
      <p>Extends forward iteration with backward movement:</p>
      <CodeBlock language="xxml">{`[ Constraint <BidirectionalIterator> <T Constrains None, Element Constrains None> (T iter)
    Require (F(Bool^)(hasPrevious)(*) On iter)
    Require (F(Element^)(previous)(*) On iter)
]`}</CodeBlock>

      <h3>Random Access Iterator</h3>
      <p>Adds index-based access:</p>
      <CodeBlock language="xxml">{`[ Constraint <RandomAccessIterator> <T Constrains None, Element Constrains None> (T iter)
    Require (F(None)(advance)(Integer^) On iter)
    Require (F(Element^)(at)(Integer^) On iter)
    Require (F(Integer^)(index)(*) On iter)
]`}</CodeBlock>

      <ClassHeader name="ListIterator<T>" description="Random access iterator for List. Supports forward, backward, and index-based traversal." />

      <h3>Forward Iteration</h3>
      <MethodTable
        methods={[
          { name: "hasNext", params: "", returns: "Bool^", desc: "More elements ahead" },
          { name: "next", params: "", returns: "T^", desc: "Advance and return element" },
          { name: "current", params: "", returns: "T^", desc: "Current element (no advance)" },
        ]}
      />

      <h3>Backward Iteration</h3>
      <MethodTable
        methods={[
          { name: "hasPrevious", params: "", returns: "Bool^", desc: "More elements behind" },
          { name: "previous", params: "", returns: "T^", desc: "Move back and return element" },
        ]}
      />

      <h3>Random Access</h3>
      <MethodTable
        methods={[
          { name: "advance", params: "n: Integer^", returns: "None", desc: "Move n positions forward" },
          { name: "at", params: "idx: Integer^", returns: "T^", desc: "Get element at absolute index" },
          { name: "index", params: "", returns: "Integer^", desc: "Current position" },
        ]}
      />

      <h3>Utility</h3>
      <MethodTable
        methods={[
          { name: "reset", params: "", returns: "None", desc: "Return to beginning" },
          { name: "toEnd", params: "", returns: "None", desc: "Move to end" },
          { name: "equals", params: "other: ListIterator<T>^", returns: "Bool^", desc: "Compare positions" },
          { name: "distance", params: "other: ListIterator<T>^", returns: "Integer^", desc: "Elements between iterators" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Collections::List<Integer>^ As <nums> = Collections::List@Integer::Constructor();
Run nums.add(Integer::Constructor(10));
Run nums.add(Integer::Constructor(20));
Run nums.add(Integer::Constructor(30));

Instantiate Collections::ListIterator<Integer>^ As <iter> = nums.begin();

// Forward iteration
While (iter.hasNext()) -> {
    Run Console::printLine(iter.next().toString());
}
// Output: 10, 20, 30

// Random access
Run iter.reset();
Instantiate Integer^ As <middle> = iter.at(Integer::Constructor(1));  // 20`}</CodeBlock>

      <ClassHeader name="SetIterator<T>" description="Forward iterator for Set." />

      <h3>Iteration</h3>
      <MethodTable
        methods={[
          { name: "hasNext", params: "", returns: "Bool^", desc: "More elements available" },
          { name: "next", params: "", returns: "T^", desc: "Advance and return element" },
          { name: "current", params: "", returns: "T^", desc: "Current element" },
          { name: "reset", params: "", returns: "None", desc: "Return to beginning" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Collections::Set<String>^ As <tags> = Collections::Set@String::Constructor();
Run tags.add(String::Constructor("a"));
Run tags.add(String::Constructor("b"));

Instantiate Collections::SetIterator<String>^ As <iter> = tags.begin();
While (iter.hasNext()) -> {
    Run Console::printLine(iter.next());
}`}</CodeBlock>

      <ClassHeader name="HashMapIterator<K, V>" description="Forward iterator for HashMap, yields key-value pairs." />

      <h3>Iteration</h3>
      <MethodTable
        methods={[
          { name: "hasNext", params: "", returns: "Bool^", desc: "More entries available" },
          { name: "next", params: "", returns: "KeyValuePair<K,V>^", desc: "Advance and return entry" },
          { name: "current", params: "", returns: "KeyValuePair<K,V>^", desc: "Current entry" },
          { name: "currentKey", params: "", returns: "K&", desc: "Reference to current key" },
          { name: "currentValue", params: "", returns: "V&", desc: "Reference to current value" },
          { name: "reset", params: "", returns: "None", desc: "Return to beginning" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Collections::HashMap<String, Integer>^ As <scores> =
    Collections::HashMap@String, Integer::Constructor();
Run scores.put(String::Constructor("Alice"), Integer::Constructor(95));
Run scores.put(String::Constructor("Bob"), Integer::Constructor(87));

Instantiate Collections::HashMapIterator<String, Integer>^ As <iter> = scores.begin();
While (iter.hasNext()) -> {
    Instantiate Collections::KeyValuePair<String, Integer>^ As <entry> = iter.next();
    Instantiate String^ As <line> = entry.key().append(String::Constructor(": "));
    Set line = line.append(entry.value().toString());
    Run Console::printLine(line);
}`}</CodeBlock>

      <ClassHeader name="KeyValuePair<K, V>" description="Non-owning view of a key-value pair from HashMap iteration." />

      <h3>Access</h3>
      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "KeyValuePair<K,V>^", desc: "Empty pair" },
          { name: "Constructor", params: "k: K^, v: V^", returns: "KeyValuePair<K,V>^", desc: "Pair with key and value" },
          { name: "key", params: "", returns: "K&", desc: "Reference to key" },
          { name: "value", params: "", returns: "V&", desc: "Reference to value" },
          { name: "toString", params: "", returns: "String^", desc: "(key, value) format" },
        ]}
      />

      <Callout type="info">
        KeyValuePair is a non-owning view. It doesn&apos;t own the key/value data - they remain
        owned by the HashMap.
      </Callout>

      <h2>Common Patterns</h2>

      <h3>Foreach-style Loop</h3>
      <CodeBlock language="xxml">{`Instantiate Collections::ListIterator<Integer>^ As <iter> = list.begin();
While (iter.hasNext()) -> {
    Instantiate Integer^ As <item> = iter.next();
    // Use item
}`}</CodeBlock>

      <h3>Index-based Access</h3>
      <CodeBlock language="xxml">{`For (Integer <i> = 0 .. list.size().toInt64()) -> {
    Instantiate Integer^ As <item> = list.get(i);
    // Use item
}`}</CodeBlock>

      <h3>Early Exit</h3>
      <CodeBlock language="xxml">{`Instantiate Collections::ListIterator<String>^ As <iter> = names.begin();
While (iter.hasNext()) -> {
    Instantiate String^ As <name> = iter.next();
    If (name.equals(String::Constructor("target"))) -> {
        Run Console::printLine(String::Constructor("Found!"));
        Break;
    }
}`}</CodeBlock>

      <h2>Iterable Constraint</h2>
      <p>Containers that support iteration implement:</p>
      <CodeBlock language="xxml">{`[ Constraint <Iterable> <Container Constrains None, IteratorType Constrains None>
    Require (F(IteratorType^)(begin)(*) On container)
    Require (F(Integer^)(size)(*) On container)
]`}</CodeBlock>

      <h2>See Also</h2>
      <div className="not-prose mt-4 flex flex-wrap gap-2">
        <a href="/docs/standard-library/collections" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Collections
        </a>
        <a href="/docs/language-reference/generics" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Generics
        </a>
        <a href="/docs/language-reference/constraints" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Constraints
        </a>
      </div>
    </>
  );
}
