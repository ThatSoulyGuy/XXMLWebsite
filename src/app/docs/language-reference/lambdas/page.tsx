export const metadata = {
  title: "Lambdas",
  description: "XXML anonymous functions and closures",
};

export default function LambdasPage() {
  return (
    <>
      <h1>Lambdas</h1>
      <p className="lead">
        XXML supports anonymous functions (lambdas) with closures, capturing variables
        from the enclosing scope with explicit ownership semantics.
      </p>

      <h2>Lambda Syntax</h2>
      <pre>
        <code>{`[ Lambda [captures] Returns ReturnType Parameters (parameters) {
    // body
}]`}</code>
      </pre>

      <h2>Basic Lambda</h2>
      <pre>
        <code>{`// Lambda with no captures
Instantiate F(Integer^)(Integer&)^ As <double> = [ Lambda [] Returns Integer^ Parameters (
    Parameter <n> Types Integer&
) {
    Return n.multiply(Integer::Constructor(2));
}];

// Calling the lambda
Instantiate Integer^ As <result> = double.call(Integer::Constructor(5));
Run Console::printLine(result.toString());  // Prints: 10`}</code>
      </pre>

      <h2>Capture Modes</h2>
      <p>
        Lambdas can capture variables from the enclosing scope with three different
        ownership semantics:
      </p>

      <h3>Copy Capture (<code>%</code>)</h3>
      <p>Creates an independent copy of the variable inside the lambda:</p>
      <pre>
        <code>{`Instantiate Integer^ As <multiplier> = Integer::Constructor(5);

Instantiate F(Integer^)(Integer&)^ As <multiply> = [ Lambda [%multiplier] Returns Integer^ Parameters (
    Parameter <n> Types Integer&
) {
    Return n.multiply(multiplier);
}];

// multiplier is still accessible here
Instantiate Integer^ As <result> = multiply.call(Integer::Constructor(10));
Run Console::printLine(result.toString());  // Prints: 50`}</code>
      </pre>

      <h3>Owned Capture (<code>^</code>)</h3>
      <p>Moves ownership of the variable into the lambda:</p>
      <pre>
        <code>{`Instantiate String^ As <secret> = String::Constructor("password123");

Instantiate F(String^)()^ As <getSecret> = [ Lambda [^secret] Returns String^ Parameters () {
    Return secret;
}];

// secret is NO LONGER accessible here - ownership moved to lambda`}</code>
      </pre>

      <h3>Reference Capture (<code>&amp;</code>)</h3>
      <p>Captures a reference to the variable:</p>
      <pre>
        <code>{`Instantiate Integer^ As <counter> = Integer::Constructor(0);

Instantiate F(Integer^)()^ As <getCount> = [ Lambda [&counter] Returns Integer^ Parameters () {
    Return counter;
}];

// counter is still owned here, lambda just borrows it
Set counter = counter.add(Integer::Constructor(1));
Instantiate Integer^ As <count> = getCount.call();  // Returns current counter value`}</code>
      </pre>

      <h2>Multiple Captures</h2>
      <pre>
        <code>{`Instantiate Integer^ As <a> = Integer::Constructor(5);
Instantiate Integer^ As <b> = Integer::Constructor(10);
Instantiate Integer^ As <ref> = Integer::Constructor(100);

Instantiate F(Integer^)()^ As <compute> = [ Lambda [%a, ^b, &ref] Returns Integer^ Parameters () {
    Instantiate Integer^ As <sum> = a.add(b);
    Return sum.add(ref);
}];

// a is still accessible (was copied)
// b is NOT accessible (was moved)
// ref is still accessible (was borrowed)`}</code>
      </pre>

      <h2>Lambdas with Multiple Parameters</h2>
      <pre>
        <code>{`Instantiate F(Integer^)(Integer&, Integer&)^ As <add> = [ Lambda [] Returns Integer^ Parameters (
    Parameter <x> Types Integer&,
    Parameter <y> Types Integer&
) {
    Return x.add(y);
}];

Instantiate Integer^ As <sum> = add.call(
    Integer::Constructor(15),
    Integer::Constructor(7)
);
Run Console::printLine(sum.toString());  // Prints: 22`}</code>
      </pre>

      <h2>Void Lambdas</h2>
      <pre>
        <code>{`Instantiate F(None)(String&)^ As <printer> = [ Lambda [] Returns None Parameters (
    Parameter <msg> Types String&
) {
    Run Console::printLine(msg);
}];

Run printer.call(String::Constructor("Hello from lambda!"));`}</code>
      </pre>

      <h2>Lambda Templates</h2>
      <p>Lambdas can have their own type parameters:</p>
      <pre>
        <code>{`Instantiate __function^ As <identity> = [ Lambda [] Templates <T Constrains None> Returns T^ Parameters (
    Parameter <x> Types T^
) {
    Return x;
}];

// Call with different types
Instantiate Integer^ As <intResult> = identity<Integer>.call(Integer::Constructor(42));
Instantiate String^ As <strResult> = identity<String>.call(String::Constructor("Hello"));`}</code>
      </pre>

      <h3>Lambda Templates with Constraints</h3>
      <pre>
        <code>{`[ Constraint <Printable> <T Constrains None> (T a)
    Require (F(String^)(toString)(*) On a)
]

Instantiate __function^ As <printValue> = [ Lambda [] Templates <T Constrains Printable> Returns None Parameters (
    Parameter <value> Types T^
) {
    Run Console::printLine(value.toString());
}];

Run printValue<Integer>.call(Integer::Constructor(42));
Run printValue<String>.call(String::Constructor("Hello"));`}</code>
      </pre>

      <h2>Function Types</h2>
      <p>The function type syntax is <code>F(ReturnType)(ParamTypes...)</code>:</p>
      <pre>
        <code>{`// Function taking no parameters, returning Integer
F(Integer^)()

// Function taking Integer&, returning String
F(String^)(Integer&)

// Function taking two parameters
F(Integer^)(Integer&, Integer&)

// Function returning nothing
F(None)(String&)`}</code>
      </pre>

      <h2>Passing Lambdas to Methods</h2>
      <pre>
        <code>{`[ Class <Processor> Final Extends None
    [ Public <>
        Constructor = default;

        Method <process> Returns Integer^ Parameters (
            Parameter <value> Types Integer^,
            Parameter <transform> Types F(Integer^)(Integer&)^
        ) Do
        {
            Return transform.call(value);
        }
    ]
]

[ Entrypoint
    {
        Instantiate Processor^ As <proc> = Processor::Constructor();

        Instantiate F(Integer^)(Integer&)^ As <triple> = [ Lambda [] Returns Integer^ Parameters (
            Parameter <n> Types Integer&
        ) {
            Return n.multiply(Integer::Constructor(3));
        }];

        Instantiate Integer^ As <result> = proc.process(
            Integer::Constructor(10),
            triple
        );

        Run Console::printLine(result.toString());  // Prints: 30
        Exit(0);
    }
]`}</code>
      </pre>
    </>
  );
}
