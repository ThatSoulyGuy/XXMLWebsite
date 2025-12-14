import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Reflection",
  description: "Runtime type introspection in XXML",
};

export default function ReflectionPage() {
  return (
    <>
      <h1>Reflection</h1>
      <p className="lead">
        XXML&apos;s reflection system allows runtime introspection of types,
        enabling frameworks for serialization, validation, and dependency
        injection.
      </p>

      <h2>Import</h2>
      <CodeBlock language="xxml">{`#import Language::Reflection;`}</CodeBlock>

      <h2>Type Class</h2>
      <p>
        The <code>Type</code> class provides access to type metadata:
      </p>
      <CodeBlock language="xxml">{`// Get type information by name
Instantiate Type^ As <type> = Type::forName(String::Constructor("MyClass"));

// Get type name
Instantiate String^ As <name> = type.getName();

// Check if class is final
Instantiate Bool^ As <isFinal> = type.isFinal();

// Get base class name
Instantiate String^ As <base> = type.getBaseClassName();`}</CodeBlock>

      <h2>Property Introspection</h2>
      <CodeBlock language="xxml">{`// Get property count
Instantiate Integer^ As <count> = type.getPropertyCount();

// Iterate over properties
For (Integer <i> = 0 .. count) -> {
    Instantiate PropertyInfo^ As <prop> = type.getPropertyAt(i);

    Instantiate String^ As <propName> = prop.getName();
    Instantiate String^ As <propType> = prop.getTypeName();
    Instantiate String^ As <ownership> = prop.getOwnership();

    Run Console::printLine(propName);
}`}</CodeBlock>

      <h2>Method Introspection</h2>
      <CodeBlock language="xxml">{`// Get method count
Instantiate Integer^ As <methodCount> = type.getMethodCount();

// Get method by name
Instantiate MethodInfo^ As <method> = type.getMethodByName(String::Constructor("doSomething"));

// Get method details
Instantiate String^ As <returnType> = method.getReturnTypeName();
Instantiate Integer^ As <paramCount> = method.getParameterCount();`}</CodeBlock>

      <h2>Annotation Access</h2>
      <p>
        Access annotations that were marked with <code>Retain</code>:
      </p>
      <CodeBlock language="xxml">{`// Check annotation count
Instantiate Integer^ As <annotCount> = type.getAnnotationCount();

// Get annotation by index
Instantiate AnnotationInfo^ As <annot> = type.getAnnotationAt(Integer::Constructor(0));

// Get annotation name
Instantiate String^ As <annotName> = annot.getName();

// Get annotation arguments
Instantiate AnnotationArg^ As <arg> = annot.getArgumentByName(String::Constructor("value"));
Instantiate String^ As <argValue> = arg.asString();`}</CodeBlock>

      <Callout type="info">
        Only annotations declared with the <code>Retain</code> keyword are
        available at runtime. Compile-time-only annotations are discarded after
        processing.
      </Callout>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="reflection-example.xxml">{`#import Language::Core;
#import Language::Reflection;

[ Annotation <Entity> Allows (AnnotationAllow::Classes) Retain
    Annotate (String^)(tableName);
]

@Entity(tableName = "users")
[ Class <User> Final Extends None
    [ Public <>
        Property <id> Types Integer^;
        Property <name> Types String^;
        Constructor = default;
    ]
]

[ Entrypoint
    {
        // Get type info
        Instantiate Type^ As <type> = Type::forName(String::Constructor("User"));

        // Read annotation
        Instantiate AnnotationInfo^ As <entity> = type.getAnnotationAt(Integer::Constructor(0));
        Instantiate AnnotationArg^ As <tableArg> = entity.getArgumentByName(String::Constructor("tableName"));

        Run Console::printLine(String::Constructor("Table: ").append(tableArg.asString()));
        // Output: Table: users

        // List properties
        Instantiate Integer^ As <propCount> = type.getPropertyCount();
        For (Integer <i> = 0 .. propCount) -> {
            Instantiate PropertyInfo^ As <prop> = type.getPropertyAt(i);
            Run Console::printLine(prop.getName());
        }
        // Output: id, name

        Exit(0);
    }
]`}</CodeBlock>

      <h2>Use Cases</h2>
      <ul>
        <li>
          <strong>Serialization:</strong> Automatically convert objects to
          JSON/XML based on their structure
        </li>
        <li>
          <strong>Validation:</strong> Read validation annotations and verify
          property values
        </li>
        <li>
          <strong>Dependency Injection:</strong> Automatically wire dependencies
          based on annotations
        </li>
        <li>
          <strong>ORM:</strong> Map classes to database tables using reflection
        </li>
      </ul>

      <h2>Next Steps</h2>
      <p>
        Learn about{" "}
        <a href="/docs/advanced/annotations">Annotations</a> to define custom
        metadata for your classes.
      </p>
    </>
  );
}
