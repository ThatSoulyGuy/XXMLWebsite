import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Threading",
  description: "Multithreading and concurrency in XXML",
};

export default function ThreadingPage() {
  return (
    <>
      <h1>Threading</h1>
      <p className="lead">
        XXML provides comprehensive multithreading support through high-level
        classes that wrap platform-native threading primitives, with
        compile-time safety through Sendable and Sharable constraints.
      </p>

      <h2>Quick Start</h2>
      <CodeBlock language="xxml">{`#import Language::Core;
#import Language::Concurrent;

[ Entrypoint
    {
        // Create and start a thread with a lambda
        Instantiate F(None^)()^ As <work> = [ Lambda [] Returns None^ Parameters () {
            Run Console::printLine(String::Constructor("Hello from thread!"));
            Return None::Constructor();
        }];

        Instantiate Concurrent::Thread^ As <t> = Concurrent::Thread::spawn(work);

        // Wait for thread to complete
        Run t.join();

        Run Console::printLine(String::Constructor("Thread finished!"));
        Exit(0);
    }
]`}</CodeBlock>

      <h2>Thread Safety Constraints</h2>

      <h3>Sendable</h3>
      <p>
        Marks types safe to <strong>move</strong> across thread boundaries:
      </p>
      <CodeBlock language="xxml">{`@Derive(trait = "Sendable")
[ Class <Message> Final Extends None
    [ Public <>
        Property <id> Types Integer^;
        Property <content> Types String^;
        Constructor = default;
    ]
]

// Message can be safely moved to another thread`}</CodeBlock>

      <h3>Sharable</h3>
      <p>
        Marks types safe to <strong>share</strong> (reference) across threads:
      </p>
      <CodeBlock language="xxml">{`@Derive(trait = "Sharable")
[ Class <Config> Final Extends None
    [ Public <>
        Property <maxConnections> Types Integer^;

        // Immutable after construction
        Constructor Parameters (Parameter <max> Types Integer^) -> {
            Set maxConnections = max;
        }
    ]
]`}</CodeBlock>

      <Callout type="info">
        <code>Sendable</code> types cannot have reference (<code>&amp;</code>)
        fields. <code>Sharable</code> types should be immutable after
        construction.
      </Callout>

      <h2>Thread Class</h2>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Method
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Returns
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>spawn(func)</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <code>Thread^</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Create and start a new thread
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>join()</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <code>Bool^</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Wait for thread to complete
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>detach()</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <code>Bool^</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Let thread run independently
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>sleep(ms)</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <code>None</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Sleep current thread
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>currentId()</code>
              </td>
              <td className="px-4 py-3 text-sm">
                <code>Integer^</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Get current thread ID
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Mutex and LockGuard</h2>
      <CodeBlock language="xxml">{`Instantiate Concurrent::Mutex^ As <mutex> = Concurrent::Mutex::Constructor();

// Using LockGuard (RAII-style)
{
    Instantiate Concurrent::LockGuard^ As <guard> = Concurrent::LockGuard::Constructor(mutex);

    // Critical section - mutex is held
    // ...

    // Lock automatically released when guard goes out of scope
}`}</CodeBlock>

      <h2>Atomic Operations</h2>
      <CodeBlock language="xxml">{`Instantiate Concurrent::Atomic^ As <counter> = Concurrent::Atomic::Constructor();

// Increment atomically
Instantiate Integer^ As <newVal> = counter.increment();

// Add value
Run counter.add(Integer::Constructor(5));

// Compare and swap
Instantiate Bool^ As <success> = counter.compareAndSwap(
    Integer::Constructor(6),   // expected
    Integer::Constructor(10)   // desired
);`}</CodeBlock>

      <h2>Condition Variables</h2>
      <CodeBlock language="xxml">{`Instantiate Concurrent::Mutex^ As <mutex> = Concurrent::Mutex::Constructor();
Instantiate Concurrent::ConditionVariable^ As <cond> = Concurrent::ConditionVariable::Constructor();
Instantiate Concurrent::Atomic^ As <dataReady> = Concurrent::Atomic::Constructor();

// Consumer waits for data
Run mutex.lock();
While (dataReady.get().equals(Integer::Constructor(0))) -> {
    Run cond.wait(mutex);
}
Run mutex.unlock();

// Producer signals data ready
Run mutex.lock();
Run dataReady.set(Integer::Constructor(1));
Run cond.signal();
Run mutex.unlock();`}</CodeBlock>

      <h2>Semaphore</h2>
      <CodeBlock language="xxml">{`// Pool of 2 resources
Instantiate Concurrent::Semaphore^ As <pool> = Concurrent::Semaphore::Constructor(
    Integer::Constructor(2)
);

// Acquire a resource
Run pool.acquire();
// ... use the resource ...
Run pool.release();`}</CodeBlock>

      <h2>Complete Example: Parallel Counter</h2>
      <CodeBlock language="xxml" filename="parallel-counter.xxml">{`#import Language::Core;
#import Language::Concurrent;

[ Entrypoint
    {
        Instantiate Concurrent::Atomic^ As <counter> = Concurrent::Atomic::Constructor();

        Instantiate F(None^)()^ As <worker1> = [ Lambda [&counter] Returns None^ Parameters () {
            Run Console::printLine(String::Constructor("Worker 1 starting"));
            Run counter.increment();
            Run counter.increment();
            Run counter.increment();
            Return None::Constructor();
        }];

        Instantiate F(None^)()^ As <worker2> = [ Lambda [&counter] Returns None^ Parameters () {
            Run Console::printLine(String::Constructor("Worker 2 starting"));
            Run counter.increment();
            Run counter.increment();
            Run counter.increment();
            Return None::Constructor();
        }];

        Instantiate Concurrent::Thread^ As <t1> = Concurrent::Thread::spawn(worker1);
        Instantiate Concurrent::Thread^ As <t2> = Concurrent::Thread::spawn(worker2);

        Run t1.join();
        Run t2.join();

        // Final count should be 6
        Run Console::printLine(String::Constructor("Final count: "));
        Run Console::printLine(counter.get().toString());

        Exit(0);
    }
]`}</CodeBlock>

      <h2>Best Practices</h2>
      <ul>
        <li>
          <strong>Use LockGuard:</strong> RAII-style locking prevents deadlocks
          from forgotten unlocks
        </li>
        <li>
          <strong>Prefer Atomics:</strong> For simple counters, atomics are
          faster than mutex locks
        </li>
        <li>
          <strong>Avoid Deadlocks:</strong> Always acquire locks in the same
          order
        </li>
        <li>
          <strong>Loop on Conditions:</strong> Always use while loops with
          condition variables to handle spurious wakeups
        </li>
      </ul>

      <h2>Class Reference</h2>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Class
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Thread</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Execution thread with lambda support
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Mutex</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Mutual exclusion lock
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>LockGuard</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                RAII scoped lock
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Atomic</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Thread-safe atomic integer
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>ConditionVariable</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Thread coordination/signaling
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>Semaphore</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Counting semaphore
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>ThreadLocal&lt;T&gt;</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Per-thread storage
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Next Steps</h2>
      <p>
        Learn about <a href="/docs/advanced/derives">Derives</a> for Sendable
        and Sharable constraints, or explore{" "}
        <a href="/docs/language-reference/lambdas">Lambdas</a> for creating
        thread functions.
      </p>
    </>
  );
}
