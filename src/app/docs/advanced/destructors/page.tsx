import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Destructors",
  description: "RAII-style resource cleanup in XXML",
};

export default function DestructorsPage() {
  return (
    <>
      <h1>Destructors</h1>
      <p className="lead">
        XXML implements RAII (Resource Acquisition Is Initialization) through
        destructors that automatically clean up resources when objects go out of
        scope.
      </p>

      <h2>Basic Syntax</h2>
      <CodeBlock language="xxml">{`[ Class <MyClass> Final Extends None
    [ Private <>
        Property <resource> Types NativeType<"ptr">^;
    ]

    [ Public <>
        Constructor Parameters () -> {
            Set resource = Syscall::malloc(1024);
        }

        Destructor Parameters () -> {
            Run Syscall::free(resource);
        }
    ]
]`}</CodeBlock>

      <h2>Automatic Cleanup</h2>
      <p>
        Destructors are called automatically when a variable goes out of scope:
      </p>
      <CodeBlock language="xxml">{`[ Entrypoint
    {
        // Constructor called here
        Instantiate MyClass^ As <obj> = MyClass::Constructor();

        // ... use obj ...

        // Destructor called automatically at end of scope
    }
]`}</CodeBlock>

      <Callout type="info">
        The compiler automatically inserts destructor calls at the end of each
        scope, ensuring resources are cleaned up even if the program exits
        early.
      </Callout>

      <h2>Use Cases</h2>

      <h3>File Handles</h3>
      <CodeBlock language="xxml">{`[ Class <FileHandle> Final Extends None
    [ Private <>
        Property <handle> Types NativeType<"ptr">^;
    ]

    [ Public <>
        Constructor Parameters (Parameter <path> Types String%) -> {
            Set handle = openFile(path);
        }

        Destructor Parameters () -> {
            Run closeFile(handle);
        }

        Method <read> Returns String^ Parameters () Do {
            // Read from file
        }
    ]
]`}</CodeBlock>

      <h3>Lock Guards</h3>
      <CodeBlock language="xxml">{`[ Class <LockGuard> Final Extends None
    [ Private <>
        Property <mutex> Types Mutex&;
    ]

    [ Public <>
        Constructor Parameters (Parameter <m> Types Mutex&) -> {
            Set mutex = m;
            Run mutex.lock();
        }

        Destructor Parameters () -> {
            Run mutex.unlock();
        }
    ]
]`}</CodeBlock>

      <h2>Destructor Chaining</h2>
      <p>
        When a class has properties that are themselves objects with
        destructors, those destructors are called in reverse order of
        construction:
      </p>
      <CodeBlock language="xxml">{`[ Class <Container> Final Extends None
    [ Private <>
        Property <buffer> Types Buffer^;
        Property <logger> Types Logger^;
    ]

    [ Public <>
        Constructor Parameters () -> {
            // logger constructed first, buffer second
            Set logger = Logger::Constructor();
            Set buffer = Buffer::Constructor();
        }

        Destructor Parameters () -> {
            // buffer destructor called first, logger second
            // (reverse order)
        }
    ]
]`}</CodeBlock>

      <h2>Best Practices</h2>
      <ul>
        <li>
          <strong>Always pair resources:</strong> If your constructor acquires a
          resource, your destructor should release it
        </li>
        <li>
          <strong>Keep destructors simple:</strong> Avoid complex logic or
          operations that might fail
        </li>
        <li>
          <strong>Use RAII wrappers:</strong> Create small classes to manage
          specific resources
        </li>
        <li>
          <strong>Don&apos;t throw from destructors:</strong> Avoid operations
          that might cause errors during cleanup
        </li>
      </ul>

      <h2>Next Steps</h2>
      <p>
        Learn about <a href="/docs/language-reference/ownership">Ownership</a>{" "}
        to understand how destructors integrate with XXML&apos;s memory
        management system.
      </p>
    </>
  );
}
