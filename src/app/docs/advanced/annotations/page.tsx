import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Annotations",
  description: "Java-style annotation system in XXML",
};

export default function AnnotationsPage() {
  return (
    <>
      <h1>Annotations</h1>
      <p className="lead">
        XXML supports a Java-style annotation system for adding metadata to code
        elements. Annotations can be processed at compile-time or retained for
        runtime reflection.
      </p>

      <h2>Defining Annotations</h2>
      <CodeBlock language="xxml">{`// Simple marker annotation
[ Annotation <Immutable> Allows (AnnotationAllow::Classes) ]

// Annotation with runtime retention
[ Annotation <Serializable> Allows (AnnotationAllow::Classes) Retain ]

// Annotation with parameters
[ Annotation <Range> Allows (AnnotationAllow::Properties) Retain
    Annotate (Integer^)(min);
    Annotate (Integer^)(max);
]`}</CodeBlock>

      <h2>Annotation Targets</h2>
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Target
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>AnnotationAllow::Classes</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Class declarations
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>AnnotationAllow::Methods</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Method declarations
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>AnnotationAllow::Properties</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Property declarations
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>AnnotationAllow::Parameters</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Method parameters
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>AnnotationAllow::Constructors</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Constructor declarations
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <code>AnnotationAllow::All</code>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-300">
                Any target
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Using Annotations</h2>
      <CodeBlock language="xxml">{`@Entity
@Serializable(format = "json")
[ Class <User> Final Extends None
    [ Public <>
        @Column(name = "user_id", nullable = false)
        Property <id> Types Integer^;

        @Column(name = "user_name", nullable = false)
        @MinLength(value = 1)
        Property <name> Types String^;

        @Range(min = 0, max = 150)
        Property <age> Types Integer^;
    ]
]`}</CodeBlock>

      <h2>Default Values</h2>
      <p>Annotation parameters can have default values:</p>
      <CodeBlock language="xxml">{`[ Annotation <Config> Allows (AnnotationAllow::Classes)
    Annotate (String^)(name);            // Required
    Annotate (Integer^)(version) = 1;    // Optional, default is 1
    Annotate (Bool^)(debug) = false;     // Optional, default is false
]

// Only required parameters need to be specified
@Config(name = "MyApp")  // version=1, debug=false by default
[ Class <App> ... ]`}</CodeBlock>

      <h2>Inline Processors</h2>
      <p>
        Annotations can include inline processors that run during compilation:
      </p>
      <CodeBlock language="xxml">{`[ Annotation <Review> Allows (AnnotationAllow::Classes, AnnotationAllow::Methods)
    Annotate (String^)(message);

    [ Processor
        [ Public <>
            Method <onAnnotate> Returns None Parameters (
                Parameter <reflectionContext> Types ReflectionContext&,
                Parameter <compilationContext> Types CompilationContext&
            ) -> {
                Run compilationContext.warning(
                    String::Constructor("Code is under review")
                );
            }
        ]
    ]
]`}</CodeBlock>

      <Callout type="info">
        Inline processors have access to <code>ReflectionContext</code> for
        inspecting the annotated element and <code>CompilationContext</code> for
        emitting messages, warnings, or errors.
      </Callout>

      <h2>Built-in Annotations</h2>

      <h3>@Deprecated</h3>
      <CodeBlock language="xxml">{`@Deprecated
[ Class <OldApi> Final Extends None ... ]
// Compiler warning: class 'OldApi' is deprecated

@Deprecated(reason = "Use NewApi instead")
Method <oldMethod> Returns None Parameters () -> { ... }
// Compiler warning: method 'oldMethod' is deprecated: Use NewApi instead`}</CodeBlock>

      <h3>@Derive</h3>
      <CodeBlock language="xxml">{`@Derive(trait = "Stringable")
@Derive(trait = "Equatable")
@Derive(trait = "Hashable")
[ Class <Point> Final Extends None ... ]`}</CodeBlock>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="validation.xxml">{`#import Language::Core;

// Define validation annotations
[ Annotation <NotNull> Allows (AnnotationAllow::Properties) Retain ]

[ Annotation <Range> Allows (AnnotationAllow::Properties) Retain
    Annotate (Integer^)(min);
    Annotate (Integer^)(max);
]

[ Annotation <Pattern> Allows (AnnotationAllow::Properties) Retain
    Annotate (String^)(regex);
]

// Use annotations for validation metadata
[ Class <Registration> Final Extends None
    [ Public <>
        @NotNull
        @Pattern(regex = "^[a-zA-Z0-9_]+$")
        Property <username> Types String^;

        @NotNull
        @Range(min = 8, max = 128)
        Property <passwordLength> Types Integer^;

        @NotNull
        @Pattern(regex = "^[^@]+@[^@]+\\\\.[^@]+$")
        Property <email> Types String^;

        Constructor = default;
    ]
]`}</CodeBlock>

      <h2>Next Steps</h2>
      <p>
        Learn about <a href="/docs/advanced/derives">Derives</a> for automatic
        method generation, or explore{" "}
        <a href="/docs/advanced/reflection">Reflection</a> to access annotation
        metadata at runtime.
      </p>
    </>
  );
}
