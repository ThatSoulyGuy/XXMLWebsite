import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Math Module",
  description: "XXML Language::Math module reference",
};

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

export default function MathPage() {
  return (
    <>
      <h1>Math Module</h1>
      <p className="lead">
        The <code>Language::Math</code> module provides mathematical constants,
        functions, and random number generation.
      </p>

      <CodeBlock language="xxml">{`#import Language::Math;`}</CodeBlock>

      <h2>Constants</h2>
      <div className="not-prose my-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <code className="text-lg font-semibold text-blue-700 dark:text-blue-300">Math::PI</code>
          <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">3.14159265358979...</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <code className="text-lg font-semibold text-green-700 dark:text-green-300">Math::E</code>
          <p className="mt-1 text-sm text-green-800 dark:text-green-200">2.71828182845904...</p>
        </div>
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <code className="text-lg font-semibold text-purple-700 dark:text-purple-300">Math::TAU</code>
          <p className="mt-1 text-sm text-purple-800 dark:text-purple-200">6.28318530717958...</p>
        </div>
      </div>

      <h2>Basic Functions</h2>
      <MethodTable
        methods={[
          { name: "abs", params: "value: Double^", returns: "Double^", desc: "Absolute value" },
          { name: "ceil", params: "value: Double^", returns: "Double^", desc: "Round up to nearest integer" },
          { name: "floor", params: "value: Double^", returns: "Double^", desc: "Round down to nearest integer" },
          { name: "round", params: "value: Double^", returns: "Double^", desc: "Round to nearest integer" },
          { name: "min", params: "a: Double^, b: Double^", returns: "Double^", desc: "Minimum of two values" },
          { name: "max", params: "a: Double^, b: Double^", returns: "Double^", desc: "Maximum of two values" },
          { name: "clamp", params: "val: Double^, min: Double^, max: Double^", returns: "Double^", desc: "Clamp value to range" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Double^ As <x> = Double::Constructor(-5.7);
Instantiate Double^ As <absX> = Math::Math::abs(x);    // 5.7
Instantiate Double^ As <ceil> = Math::Math::ceil(x);   // -5.0
Instantiate Double^ As <floor> = Math::Math::floor(x); // -6.0
Instantiate Double^ As <round> = Math::Math::round(x); // -6.0

// Clamp value between 0 and 100
Instantiate Double^ As <value> = Double::Constructor(150.0);
Instantiate Double^ As <clamped> = Math::Math::clamp(
    value,
    Double::Constructor(0.0),
    Double::Constructor(100.0)
);  // 100.0`}</CodeBlock>

      <h2>Power and Roots</h2>
      <MethodTable
        methods={[
          { name: "pow", params: "base: Double^, exp: Double^", returns: "Double^", desc: "Raise base to exponent" },
          { name: "sqrt", params: "value: Double^", returns: "Double^", desc: "Square root" },
          { name: "cbrt", params: "value: Double^", returns: "Double^", desc: "Cube root" },
          { name: "exp", params: "value: Double^", returns: "Double^", desc: "e raised to power" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Double^ As <squared> = Math::Math::pow(
    Double::Constructor(2.0),
    Double::Constructor(10.0)
);  // 1024.0

Instantiate Double^ As <root> = Math::Math::sqrt(Double::Constructor(16.0));  // 4.0
Instantiate Double^ As <cubeRoot> = Math::Math::cbrt(Double::Constructor(27.0)); // 3.0`}</CodeBlock>

      <h2>Logarithms</h2>
      <MethodTable
        methods={[
          { name: "log", params: "value: Double^", returns: "Double^", desc: "Natural logarithm (ln)" },
          { name: "log10", params: "value: Double^", returns: "Double^", desc: "Base-10 logarithm" },
          { name: "log2", params: "value: Double^", returns: "Double^", desc: "Base-2 logarithm" },
        ]}
      />

      <h2>Trigonometry</h2>
      <MethodTable
        methods={[
          { name: "sin", params: "radians: Double^", returns: "Double^", desc: "Sine" },
          { name: "cos", params: "radians: Double^", returns: "Double^", desc: "Cosine" },
          { name: "tan", params: "radians: Double^", returns: "Double^", desc: "Tangent" },
          { name: "asin", params: "value: Double^", returns: "Double^", desc: "Arc sine" },
          { name: "acos", params: "value: Double^", returns: "Double^", desc: "Arc cosine" },
          { name: "atan", params: "value: Double^", returns: "Double^", desc: "Arc tangent" },
          { name: "atan2", params: "y: Double^, x: Double^", returns: "Double^", desc: "Two-argument arc tangent" },
        ]}
      />

      <h3>Hyperbolic Functions</h3>
      <MethodTable
        methods={[
          { name: "sinh", params: "value: Double^", returns: "Double^", desc: "Hyperbolic sine" },
          { name: "cosh", params: "value: Double^", returns: "Double^", desc: "Hyperbolic cosine" },
          { name: "tanh", params: "value: Double^", returns: "Double^", desc: "Hyperbolic tangent" },
        ]}
      />

      <h3>Angle Conversion</h3>
      <MethodTable
        methods={[
          { name: "toRadians", params: "degrees: Double^", returns: "Double^", desc: "Convert degrees to radians" },
          { name: "toDegrees", params: "radians: Double^", returns: "Double^", desc: "Convert radians to degrees" },
        ]}
      />

      <CodeBlock language="xxml">{`// Calculate sine of 45 degrees
Instantiate Double^ As <degrees> = Double::Constructor(45.0);
Instantiate Double^ As <radians> = Math::Math::toRadians(degrees);
Instantiate Double^ As <sineValue> = Math::Math::sin(radians);

Run System::Console::printLine(
    String::Constructor("sin(45) = ").append(sineValue.toString())
);`}</CodeBlock>

      <h2>Random Numbers</h2>
      <MethodTable
        methods={[
          { name: "random", params: "max: Integer^", returns: "Integer^", desc: "Random integer in [0, max)" },
          { name: "randomRange", params: "min: Integer^, max: Integer^", returns: "Integer^", desc: "Random integer in [min, max)" },
          { name: "seed", params: "value: Integer^", returns: "None", desc: "Seed the random generator" },
        ]}
      />

      <CodeBlock language="xxml">{`// Seed with current time for randomness
Run Math::Math::seed(System::Console::getTimeMillis());

// Random number 0-99
Instantiate Integer^ As <r1> = Math::Math::random(Integer::Constructor(100));

// Random number 1-6 (dice roll)
Instantiate Integer^ As <dice> = Math::Math::randomRange(
    Integer::Constructor(1),
    Integer::Constructor(7)
);

Run System::Console::printLine(
    String::Constructor("Dice roll: ").append(dice.toString())
);`}</CodeBlock>

      <Callout type="info">
        Seed the random number generator at program start using
        <code>Math::Math::seed()</code> for better randomness. Using the current
        time in milliseconds is a common approach.
      </Callout>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="geometry.xxml" showLineNumbers>{`#import Language::Core;
#import Language::Math;
#import Language::System;

[ Entrypoint
    {
        // Calculate circle properties
        Instantiate Double^ As <radius> = Double::Constructor(5.0);

        Instantiate Double^ As <area> = Math::Math::PI.multiply(
            Math::Math::pow(radius, Double::Constructor(2.0))
        );

        Instantiate Double^ As <circumference> = Math::Math::TAU.multiply(radius);

        Run System::Console::printLine(String::Constructor("Circle with radius 5:"));
        Run System::Console::printLine(
            String::Constructor("  Area: ").append(area.toString())
        );
        Run System::Console::printLine(
            String::Constructor("  Circumference: ").append(circumference.toString())
        );

        // Pythagorean theorem
        Instantiate Double^ As <a> = Double::Constructor(3.0);
        Instantiate Double^ As <b> = Double::Constructor(4.0);
        Instantiate Double^ As <c> = Math::Math::sqrt(
            Math::Math::pow(a, Double::Constructor(2.0)).add(
                Math::Math::pow(b, Double::Constructor(2.0))
            )
        );

        Run System::Console::printLine(String::Constructor(""));
        Run System::Console::printLine(
            String::Constructor("Right triangle (3, 4): hypotenuse = ").append(c.toString())
        );

        // Random dice simulation
        Run Math::Math::seed(System::Console::getTimeMillis());
        Run System::Console::printLine(String::Constructor(""));
        Run System::Console::printLine(String::Constructor("Rolling 5 dice:"));

        Instantiate Integer^ As <sum> = Integer::Constructor(0);
        For (Instantiate Integer^ As <i> = Integer::Constructor(0);
             i.lessThan(Integer::Constructor(5)).toBool();
             Set i = i.add(Integer::Constructor(1)))
        {
            Instantiate Integer^ As <roll> = Math::Math::randomRange(
                Integer::Constructor(1),
                Integer::Constructor(7)
            );
            Set sum = sum.add(roll);
            Run System::Console::printLine(
                String::Constructor("  Roll ").append(i.add(Integer::Constructor(1)).toString())
                    .append(String::Constructor(": ")).append(roll.toString())
            );
        }
        Run System::Console::printLine(
            String::Constructor("  Total: ").append(sum.toString())
        );

        Exit(0);
    }
]`}</CodeBlock>

      <h2>See Also</h2>
      <div className="not-prose mt-4 flex flex-wrap gap-2">
        <a href="/docs/standard-library/core" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Core Module
        </a>
        <a href="/docs/standard-library/format" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Format Module
        </a>
      </div>
    </>
  );
}
