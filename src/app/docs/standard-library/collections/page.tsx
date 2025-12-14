import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Collections Module",
  description: "XXML Language::Collections module reference",
};

function ClassHeader({ name, description, constraints }: { name: string; description: string; constraints?: string }) {
  return (
    <div className="not-prose mb-6 rounded-lg border border-zinc-200 bg-gradient-to-r from-zinc-50 to-white p-4 dark:border-zinc-700 dark:from-zinc-800/50 dark:to-zinc-900">
      <h2 className="m-0 text-xl font-bold text-zinc-900 dark:text-zinc-100" id={name.toLowerCase().replace(/[<>,\s]/g, "")}>
        {name}
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">{description}</p>
      {constraints && (
        <p className="mt-2 text-xs font-mono text-blue-600 dark:text-blue-400">Constraints: {constraints}</p>
      )}
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

export default function CollectionsPage() {
  return (
    <>
      <h1>Collections Module</h1>
      <p className="lead">
        The <code>Language::Collections</code> module provides generic data structures
        for storing and organizing data.
      </p>

      <CodeBlock language="xxml">{`#import Language::Collections;`}</CodeBlock>

      <div className="not-prose my-8 grid gap-2 sm:grid-cols-3">
        {["List<T>", "Array<T,N>", "HashMap<K,V>", "Set<T>", "Stack<T>", "Queue<T>"].map((cls) => (
          <a
            key={cls}
            href={`#${cls.toLowerCase().replace(/[<>,\s]/g, "")}`}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-center text-sm font-medium text-zinc-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300"
          >
            {cls}
          </a>
        ))}
      </div>

      {/* List */}
      <ClassHeader
        name="List<T>"
        description="A dynamically-sized list that grows automatically. Elements are stored contiguously and accessed by index."
        constraints="T: None (any type)"
      />

      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "List<T>^", desc: "Creates empty list" },
          { name: "add", params: "value: T^", returns: "None", desc: "Appends element to end" },
          { name: "get", params: "index: Integer&", returns: "T^", desc: "Returns element at index" },
          { name: "set", params: "index: Integer&, value: T^", returns: "None", desc: "Updates element at index" },
          { name: "remove", params: "index: Integer&", returns: "None", desc: "Removes element, shifts others" },
          { name: "size", params: "", returns: "Integer^", desc: "Returns element count" },
          { name: "isEmpty", params: "", returns: "Bool^", desc: "Returns true if empty" },
          { name: "clear", params: "", returns: "None", desc: "Removes all elements" },
          { name: "dispose", params: "", returns: "None", desc: "Frees allocated memory" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Collections::List<String>^ As <fruits> =
    Collections::List@String::Constructor();

Run fruits.add(String::Constructor("Apple"));
Run fruits.add(String::Constructor("Banana"));
Run fruits.add(String::Constructor("Cherry"));

// Access elements
Instantiate String^ As <first> = fruits.get(Integer::Constructor(0));
Run System::Console::printLine(first);  // Apple

// Update element
Run fruits.set(Integer::Constructor(1), String::Constructor("Blueberry"));

// Remove element
Run fruits.remove(Integer::Constructor(0));

// Check size
Run System::Console::printLine(fruits.size().toString());  // 2`}</CodeBlock>

      {/* Array */}
      <ClassHeader
        name="Array<T, N>"
        description="Fixed-size array with compile-time constant length. More memory efficient than List for known sizes."
        constraints="T: None, N: compile-time integer constant"
      />

      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "Array<T,N>^", desc: "Allocates array of size N" },
          { name: "get", params: "index: Integer&", returns: "T^", desc: "Returns element at index" },
          { name: "set", params: "index: Integer&, value: T^", returns: "None", desc: "Sets element at index" },
          { name: "size", params: "", returns: "Integer^", desc: "Returns array capacity (N)" },
          { name: "fill", params: "value: T^", returns: "None", desc: "Sets all elements to value" },
          { name: "isValidIndex", params: "index: Integer&", returns: "Bool^", desc: "Checks bounds" },
          { name: "dispose", params: "", returns: "None", desc: "Frees allocated memory" },
        ]}
      />

      <CodeBlock language="xxml">{`// Create fixed-size array of 10 integers
Instantiate Collections::Array<Integer, 10>^ As <numbers> =
    Collections::Array@Integer, 10::Constructor();

// Fill with zeros
Run numbers.fill(Integer::Constructor(0));

// Set specific values
Run numbers.set(Integer::Constructor(0), Integer::Constructor(100));
Run numbers.set(Integer::Constructor(5), Integer::Constructor(50));

// Access element
Instantiate Integer^ As <value> = numbers.get(Integer::Constructor(5));`}</CodeBlock>

      <Callout type="info">
        Arrays have a fixed size determined at compile time. Use <code>List&lt;T&gt;</code> when
        you need dynamic sizing. Arrays are more memory-efficient when the size is known.
      </Callout>

      {/* HashMap */}
      <ClassHeader
        name="HashMap<K, V>"
        description="Hash table mapping keys to values with O(1) average-case operations using separate chaining."
        constraints="K: Hashable, Equatable | V: None"
      />

      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "HashMap<K,V>^", desc: "Creates empty map" },
          { name: "put", params: "key: K^, value: V^", returns: "None", desc: "Inserts or updates entry" },
          { name: "get", params: "key: K^", returns: "V^", desc: "Returns value for key" },
          { name: "containsKey", params: "key: K^", returns: "Bool^", desc: "Checks if key exists" },
          { name: "remove", params: "key: K^", returns: "Bool^", desc: "Removes entry, returns success" },
          { name: "size", params: "", returns: "Integer^", desc: "Returns entry count" },
          { name: "isEmpty", params: "", returns: "Bool^", desc: "Returns true if empty" },
          { name: "clear", params: "", returns: "None", desc: "Removes all entries" },
          { name: "dispose", params: "", returns: "None", desc: "Frees allocated memory" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Collections::HashMap<String, Integer>^ As <ages> =
    Collections::HashMap@String, Integer::Constructor();

// Add entries
Run ages.put(String::Constructor("Alice"), Integer::Constructor(30));
Run ages.put(String::Constructor("Bob"), Integer::Constructor(25));

// Check and get
Instantiate String^ As <name> = String::Constructor("Alice");
If (ages.containsKey(name).toBool())
{
    Instantiate Integer^ As <age> = ages.get(name);
    Run System::Console::printLine(age.toString());  // 30
}

// Update existing
Run ages.put(String::Constructor("Alice"), Integer::Constructor(31));

// Remove entry
Run ages.remove(String::Constructor("Bob"));`}</CodeBlock>

      <Callout type="warning">
        Keys must implement both <code>Hashable</code> and <code>Equatable</code> constraints.
        Built-in types like <code>String</code> and <code>Integer</code> already satisfy these requirements.
      </Callout>

      {/* Set */}
      <ClassHeader
        name="Set<T>"
        description="Unordered collection of unique values. Duplicate additions are ignored."
        constraints="T: Hashable, Equatable"
      />

      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "Set<T>^", desc: "Creates empty set" },
          { name: "add", params: "value: T^", returns: "Bool^", desc: "Adds element, returns true if new" },
          { name: "contains", params: "value: T&", returns: "Bool^", desc: "Checks if element exists" },
          { name: "remove", params: "value: T&", returns: "Bool^", desc: "Removes element, returns success" },
          { name: "size", params: "", returns: "Integer^", desc: "Returns element count" },
          { name: "isEmpty", params: "", returns: "Bool^", desc: "Returns true if empty" },
          { name: "clear", params: "", returns: "None", desc: "Removes all elements" },
          { name: "dispose", params: "", returns: "None", desc: "Frees allocated memory" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Collections::Set<String>^ As <tags> =
    Collections::Set@String::Constructor();

// Add unique values
Run tags.add(String::Constructor("xxml"));
Run tags.add(String::Constructor("programming"));
Run tags.add(String::Constructor("xxml"));  // Ignored (duplicate)

Run System::Console::printLine(tags.size().toString());  // 2

// Check membership
If (tags.contains(String::Constructor("xxml")).toBool())
{
    Run System::Console::printLine(String::Constructor("Found tag!"));
}`}</CodeBlock>

      {/* Stack */}
      <ClassHeader
        name="Stack<T>"
        description="Last-In-First-Out (LIFO) data structure. Elements are pushed and popped from the top."
        constraints="T: None (any type)"
      />

      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "Stack<T>^", desc: "Creates empty stack" },
          { name: "push", params: "value: T^", returns: "None", desc: "Pushes element onto top" },
          { name: "pop", params: "", returns: "T^", desc: "Removes and returns top" },
          { name: "peek", params: "", returns: "T^", desc: "Returns top without removing" },
          { name: "size", params: "", returns: "Integer^", desc: "Returns element count" },
          { name: "isEmpty", params: "", returns: "Bool^", desc: "Returns true if empty" },
          { name: "clear", params: "", returns: "None", desc: "Removes all elements" },
          { name: "dispose", params: "", returns: "None", desc: "Frees allocated memory" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Collections::Stack<Integer>^ As <history> =
    Collections::Stack@Integer::Constructor();

// Push elements
Run history.push(Integer::Constructor(1));
Run history.push(Integer::Constructor(2));
Run history.push(Integer::Constructor(3));

// Peek at top
Instantiate Integer^ As <top> = history.peek();
Run System::Console::printLine(top.toString());  // 3

// Pop elements (LIFO order)
While (history.isEmpty().not().toBool())
{
    Instantiate Integer^ As <value> = history.pop();
    Run System::Console::printLine(value.toString());
}
// Output: 3, 2, 1`}</CodeBlock>

      {/* Queue */}
      <ClassHeader
        name="Queue<T>"
        description="First-In-First-Out (FIFO) data structure using a circular buffer for efficient operations."
        constraints="T: None (any type)"
      />

      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "Queue<T>^", desc: "Creates empty queue" },
          { name: "enqueue", params: "value: T^", returns: "None", desc: "Adds element to back" },
          { name: "dequeue", params: "", returns: "T^", desc: "Removes and returns front" },
          { name: "peek", params: "", returns: "T^", desc: "Returns front without removing" },
          { name: "size", params: "", returns: "Integer^", desc: "Returns element count" },
          { name: "isEmpty", params: "", returns: "Bool^", desc: "Returns true if empty" },
          { name: "clear", params: "", returns: "None", desc: "Removes all elements" },
          { name: "dispose", params: "", returns: "None", desc: "Frees allocated memory" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Collections::Queue<String>^ As <tasks> =
    Collections::Queue@String::Constructor();

// Enqueue tasks
Run tasks.enqueue(String::Constructor("Task A"));
Run tasks.enqueue(String::Constructor("Task B"));
Run tasks.enqueue(String::Constructor("Task C"));

// Process tasks (FIFO order)
While (tasks.isEmpty().not().toBool())
{
    Instantiate String^ As <task> = tasks.dequeue();
    Run System::Console::printLine(String::Constructor("Processing: ").append(task));
}
// Output: Task A, Task B, Task C`}</CodeBlock>

      <h2>Memory Management</h2>
      <p>
        All collections allocate memory dynamically. Call <code>dispose()</code> when
        a collection is no longer needed to free the underlying memory.
      </p>

      <CodeBlock language="xxml">{`Instantiate Collections::List<Integer>^ As <numbers> =
    Collections::List@Integer::Constructor();

// Use the list...
Run numbers.add(Integer::Constructor(1));
Run numbers.add(Integer::Constructor(2));

// Clean up when done
Run numbers.dispose();`}</CodeBlock>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="task_manager.xxml" showLineNumbers>{`#import Language::Core;
#import Language::Collections;
#import Language::System;

[ Entrypoint
    {
        // Task queue for processing
        Instantiate Collections::Queue<String>^ As <taskQueue> =
            Collections::Queue@String::Constructor();

        // Completed task set (for deduplication)
        Instantiate Collections::Set<String>^ As <completed> =
            Collections::Set@String::Constructor();

        // Add tasks
        Run taskQueue.enqueue(String::Constructor("Initialize"));
        Run taskQueue.enqueue(String::Constructor("Process"));
        Run taskQueue.enqueue(String::Constructor("Finalize"));

        // Process all tasks
        While (taskQueue.isEmpty().not().toBool())
        {
            Instantiate String^ As <task> = taskQueue.dequeue();
            Run System::Console::printLine(String::Constructor("Running: ").append(task));
            Run completed.add(task);
        }

        // Report
        Run System::Console::printLine(
            String::Constructor("Completed ")
                .append(completed.size().toString())
                .append(String::Constructor(" tasks"))
        );

        // Cleanup
        Run taskQueue.dispose();
        Run completed.dispose();

        Exit(0);
    }
]`}</CodeBlock>

      <h2>See Also</h2>
      <div className="not-prose mt-4 flex flex-wrap gap-2">
        <a href="/docs/standard-library/core" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Core Module
        </a>
        <a href="/docs/language-reference/generics" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Generics
        </a>
        <a href="/docs/language-reference/ownership" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Ownership
        </a>
      </div>
    </>
  );
}
