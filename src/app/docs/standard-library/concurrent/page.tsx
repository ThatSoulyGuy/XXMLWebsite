import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Concurrent Module",
  description: "XXML Language::Concurrent module reference",
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

export default function ConcurrentPage() {
  return (
    <>
      <h1>Concurrent Module</h1>
      <p className="lead">
        The <code>Language::Concurrent</code> module provides multi-threading primitives
        for parallel execution and synchronization.
      </p>

      <CodeBlock language="xxml">{`#import Language::Concurrent;`}</CodeBlock>

      <div className="not-prose my-8 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {["Thread", "Mutex", "LockGuard", "ConditionVariable", "Atomic", "ThreadLocal", "Semaphore"].map((cls) => (
          <a
            key={cls}
            href={`#${cls.toLowerCase()}`}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-center text-sm font-medium text-zinc-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300"
          >
            {cls}
          </a>
        ))}
      </div>

      <Callout type="warning">
        Multi-threaded programming requires careful consideration of data races and
        deadlocks. Always use proper synchronization primitives when accessing shared data.
      </Callout>

      <ClassHeader name="Thread" description="Represents an independent thread of execution." />

      <h3>Creating Threads</h3>
      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "Thread", desc: "Create empty thread" },
          { name: "Constructor", params: "func: F(None^)()^", returns: "Thread^", desc: "Create thread with function" },
          { name: "spawn", params: "func: F(None^)()^", returns: "Thread^", desc: "Create and start thread (static)" },
        ]}
      />

      <h3>Thread Control</h3>
      <MethodTable
        methods={[
          { name: "join", params: "", returns: "Bool^", desc: "Wait for thread to complete" },
          { name: "detach", params: "", returns: "Bool^", desc: "Detach thread (runs independently)" },
          { name: "isJoinable", params: "", returns: "Bool^", desc: "Check if thread can be joined" },
        ]}
      />

      <h3>Static Methods</h3>
      <MethodTable
        methods={[
          { name: "sleep", params: "milliseconds: Integer^", returns: "None", desc: "Sleep current thread" },
          { name: "yield", params: "", returns: "None", desc: "Yield to other threads" },
          { name: "currentId", params: "", returns: "Integer^", desc: "Get current thread ID" },
        ]}
      />

      <CodeBlock language="xxml">{`// Spawn a new thread
Instantiate Concurrent::Thread^ As <worker> = Concurrent::Thread::spawn(
    Lambda () -> None^ {
        Run System::Console::printLine(String::Constructor("Hello from thread!"));
        Return None::Constructor();
    }
);

// Wait for thread to complete
Run worker.join();
Run System::Console::printLine(String::Constructor("Thread finished!"));

// Sleep current thread for 1 second
Run Concurrent::Thread::sleep(Integer::Constructor(1000));`}</CodeBlock>

      <ClassHeader name="Mutex" description="Mutual exclusion lock for protecting shared resources." />

      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "Mutex", desc: "Create new mutex" },
          { name: "lock", params: "", returns: "Bool^", desc: "Acquire the lock (blocking)" },
          { name: "unlock", params: "", returns: "Bool^", desc: "Release the lock" },
          { name: "tryLock", params: "", returns: "Bool^", desc: "Try to acquire lock (non-blocking)" },
          { name: "isValid", params: "", returns: "Bool^", desc: "Check if mutex is valid" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Concurrent::Mutex^ As <mutex> = Concurrent::Mutex::Constructor();
Instantiate Integer^ As <counter> = Integer::Constructor(0);

// In each thread:
Run mutex.lock();
Set counter = counter.add(Integer::Constructor(1));
Run mutex.unlock();`}</CodeBlock>

      <ClassHeader name="LockGuard" description="RAII-style lock that automatically unlocks when destroyed." />

      <MethodTable
        methods={[
          { name: "Constructor", params: "mutex: Mutex&", returns: "LockGuard", desc: "Create guard (acquires lock)" },
          { name: "ownsTheLock", params: "", returns: "Bool^", desc: "Check if guard holds the lock" },
          { name: "unlock", params: "", returns: "None", desc: "Manually release lock" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Concurrent::Mutex^ As <mutex> = Concurrent::Mutex::Constructor();

// LockGuard automatically locks on creation
{
    Instantiate Concurrent::LockGuard^ As <guard> = Concurrent::LockGuard::Constructor(mutex);
    // Critical section - mutex is locked
    Run System::Console::printLine(String::Constructor("Inside critical section"));
    // Mutex automatically unlocked when guard goes out of scope
}`}</CodeBlock>

      <Callout type="info">
        <code>LockGuard</code> follows the RAII pattern. The mutex is automatically
        released when the guard goes out of scope, even if an exception occurs.
      </Callout>

      <ClassHeader name="ConditionVariable" description="Synchronization primitive for thread coordination." />

      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "ConditionVariable", desc: "Create condition variable" },
          { name: "wait", params: "mutex: Mutex&", returns: "Bool^", desc: "Wait until signaled" },
          { name: "waitTimeout", params: "mutex: Mutex&, timeoutMs: Integer^", returns: "Integer^", desc: "Wait with timeout" },
          { name: "signal", params: "", returns: "Bool^", desc: "Wake one waiting thread" },
          { name: "broadcast", params: "", returns: "Bool^", desc: "Wake all waiting threads" },
          { name: "isValid", params: "", returns: "Bool^", desc: "Check if valid" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Concurrent::Mutex^ As <mutex> = Concurrent::Mutex::Constructor();
Instantiate Concurrent::ConditionVariable^ As <cv> = Concurrent::ConditionVariable::Constructor();
Instantiate Bool^ As <ready> = Bool::Constructor(false);

// Consumer thread
Run mutex.lock();
While (ready.not().toBool())
{
    Run cv.wait(mutex);
}
// Process data...
Run mutex.unlock();

// Producer thread (in another thread)
Run mutex.lock();
Set ready = Bool::Constructor(true);
Run cv.signal();
Run mutex.unlock();`}</CodeBlock>

      <ClassHeader name="Atomic" description="Lock-free atomic integer for thread-safe operations." />

      <h3>Constructors</h3>
      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "Atomic", desc: "Create with value 0" },
          { name: "Constructor", params: "initialValue: Integer^", returns: "Atomic^", desc: "Create with initial value" },
        ]}
      />

      <h3>Access</h3>
      <MethodTable
        methods={[
          { name: "get", params: "", returns: "Integer^", desc: "Get current value" },
          { name: "set", params: "newValue: Integer^", returns: "None", desc: "Set new value" },
        ]}
      />

      <h3>Atomic Operations</h3>
      <MethodTable
        methods={[
          { name: "add", params: "value: Integer^", returns: "Integer^", desc: "Add and return previous value" },
          { name: "subtract", params: "value: Integer^", returns: "Integer^", desc: "Subtract and return previous value" },
          { name: "increment", params: "", returns: "Integer^", desc: "Increment and return previous value" },
          { name: "decrement", params: "", returns: "Integer^", desc: "Decrement and return previous value" },
          { name: "compareAndSwap", params: "expected: Integer^, desired: Integer^", returns: "Bool^", desc: "CAS operation" },
          { name: "exchange", params: "newValue: Integer^", returns: "Integer^", desc: "Set and return previous value" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Concurrent::Atomic^ As <counter> = Concurrent::Atomic::Constructor(
    Integer::Constructor(0)
);

// Thread-safe increment (no mutex needed)
Run counter.increment();

// Atomic add
Run counter.add(Integer::Constructor(10));

// Compare-and-swap
Instantiate Bool^ As <success> = counter.compareAndSwap(
    Integer::Constructor(11),  // expected
    Integer::Constructor(20)   // desired
);

Run System::Console::printLine(
    String::Constructor("Counter: ").append(counter.get().toString())
);`}</CodeBlock>

      <ClassHeader name="ThreadLocal" description="Thread-local storage for per-thread data." />

      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "ThreadLocal", desc: "Create thread-local storage" },
          { name: "get", params: "", returns: "T^", desc: "Get value for current thread" },
          { name: "set", params: "value: T^", returns: "None", desc: "Set value for current thread" },
          { name: "isSet", params: "", returns: "Bool^", desc: "Check if value is set" },
          { name: "isValid", params: "", returns: "Bool^", desc: "Check if storage is valid" },
        ]}
      />

      <CodeBlock language="xxml">{`// Each thread gets its own copy
Instantiate Concurrent::ThreadLocal<String>^ As <threadName> =
    Concurrent::ThreadLocal@String::Constructor();

// Set in current thread
Run threadName.set(String::Constructor("MainThread"));

// Get in current thread
If (threadName.isSet().toBool())
{
    Instantiate String^ As <name> = threadName.get();
    Run System::Console::printLine(name);
}`}</CodeBlock>

      <ClassHeader name="Semaphore" description="Counting semaphore for limiting concurrent access." />

      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "Semaphore", desc: "Create with count 0" },
          { name: "Constructor", params: "initialCount: Integer^", returns: "Semaphore", desc: "Create with initial count" },
          { name: "acquire", params: "", returns: "None", desc: "Decrement count (blocks if 0)" },
          { name: "tryAcquire", params: "", returns: "Bool^", desc: "Try to acquire (non-blocking)" },
          { name: "release", params: "", returns: "None", desc: "Increment count" },
          { name: "getCount", params: "", returns: "Integer^", desc: "Get current count" },
        ]}
      />

      <CodeBlock language="xxml">{`// Limit concurrent connections to 3
Instantiate Concurrent::Semaphore^ As <pool> = Concurrent::Semaphore::Constructor(
    Integer::Constructor(3)
);

// Acquire a slot (blocks if all slots in use)
Run pool.acquire();
// ... do work with limited resource ...
Run pool.release();

// Non-blocking try
If (pool.tryAcquire().toBool())
{
    // Got a slot
    // ... do work ...
    Run pool.release();
}
Else
{
    Run System::Console::printLine(String::Constructor("All slots busy"));
}`}</CodeBlock>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="producer_consumer.xxml" showLineNumbers>{`#import Language::Core;
#import Language::Concurrent;
#import Language::Collections;
#import Language::System;

[ Entrypoint
    {
        // Shared state
        Instantiate Concurrent::Mutex^ As <mutex> = Concurrent::Mutex::Constructor();
        Instantiate Concurrent::ConditionVariable^ As <notEmpty> =
            Concurrent::ConditionVariable::Constructor();
        Instantiate Concurrent::ConditionVariable^ As <notFull> =
            Concurrent::ConditionVariable::Constructor();
        Instantiate Collections::Queue<Integer>^ As <queue> =
            Collections::Queue@Integer::Constructor();
        Instantiate Concurrent::Atomic^ As <done> = Concurrent::Atomic::Constructor(
            Integer::Constructor(0)
        );

        // Producer thread
        Instantiate Concurrent::Thread^ As <producer> = Concurrent::Thread::spawn(
            Lambda () -> None^ {
                For (Instantiate Integer^ As <i> = Integer::Constructor(0);
                     i.lessThan(Integer::Constructor(10)).toBool();
                     Set i = i.add(Integer::Constructor(1)))
                {
                    Run mutex.lock();

                    // Wait if queue is full (max 5 items)
                    While (queue.size().greaterOrEqual(Integer::Constructor(5)).toBool())
                    {
                        Run notFull.wait(mutex);
                    }

                    Run queue.enqueue(i);
                    Run System::Console::printLine(
                        String::Constructor("Produced: ").append(i.toString())
                    );

                    Run notEmpty.signal();
                    Run mutex.unlock();

                    Run Concurrent::Thread::sleep(Integer::Constructor(100));
                }

                Run done.set(Integer::Constructor(1));
                Run notEmpty.broadcast();
                Return None::Constructor();
            }
        );

        // Consumer thread
        Instantiate Concurrent::Thread^ As <consumer> = Concurrent::Thread::spawn(
            Lambda () -> None^ {
                While (true)
                {
                    Run mutex.lock();

                    // Wait for items
                    While (queue.isEmpty().toBool())
                    {
                        If (done.get().equals(Integer::Constructor(1)).toBool())
                        {
                            Run mutex.unlock();
                            Return None::Constructor();
                        }
                        Run notEmpty.wait(mutex);
                    }

                    Instantiate Integer^ As <item> = queue.dequeue();
                    Run System::Console::printLine(
                        String::Constructor("Consumed: ").append(item.toString())
                    );

                    Run notFull.signal();
                    Run mutex.unlock();

                    Run Concurrent::Thread::sleep(Integer::Constructor(150));
                }

                Return None::Constructor();
            }
        );

        // Wait for threads to complete
        Run producer.join();
        Run consumer.join();

        Run System::Console::printLine(String::Constructor("All done!"));
        Exit(0);
    }
]`}</CodeBlock>

      <h2>See Also</h2>
      <div className="not-prose mt-4 flex flex-wrap gap-2">
        <a href="/docs/standard-library/system" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          System Module
        </a>
        <a href="/docs/standard-library/collections" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Collections Module
        </a>
      </div>
    </>
  );
}
