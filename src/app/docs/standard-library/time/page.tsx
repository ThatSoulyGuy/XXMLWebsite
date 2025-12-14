import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata = {
  title: "Time Module",
  description: "XXML Language::Time module reference",
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

export default function TimePage() {
  return (
    <>
      <h1>Time Module</h1>
      <p className="lead">
        The <code>Language::Time</code> module provides date/time handling, duration
        calculations, and performance timing.
      </p>

      <CodeBlock language="xxml">{`#import Language::Time;`}</CodeBlock>

      <div className="not-prose my-8 grid gap-2 sm:grid-cols-3">
        {["DateTime", "TimeSpan", "Timer"].map((cls) => (
          <a
            key={cls}
            href={`#${cls.toLowerCase()}`}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-center text-sm font-medium text-zinc-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300"
          >
            {cls}
          </a>
        ))}
      </div>

      <ClassHeader name="DateTime" description="Represents a specific point in time with date and time components." />

      <h3>Static Constructors</h3>
      <MethodTable
        methods={[
          { name: "now", params: "", returns: "DateTime^", desc: "Current date/time" },
          { name: "fromTimestamp", params: "ms: Integer^", returns: "DateTime^", desc: "Create from Unix timestamp (ms)" },
          { name: "create", params: "year, month, day, hour, min, sec: Integer^", returns: "DateTime^", desc: "Create from components" },
        ]}
      />

      <h3>Component Access</h3>
      <MethodTable
        methods={[
          { name: "year", params: "", returns: "Integer^", desc: "Get year" },
          { name: "month", params: "", returns: "Integer^", desc: "Get month (1-12)" },
          { name: "day", params: "", returns: "Integer^", desc: "Get day of month" },
          { name: "hour", params: "", returns: "Integer^", desc: "Get hour (0-23)" },
          { name: "minute", params: "", returns: "Integer^", desc: "Get minute" },
          { name: "second", params: "", returns: "Integer^", desc: "Get second" },
          { name: "millisecond", params: "", returns: "Integer^", desc: "Get millisecond" },
          { name: "dayOfWeek", params: "", returns: "Integer^", desc: "Day of week (0=Sunday)" },
          { name: "dayOfYear", params: "", returns: "Integer^", desc: "Day of year (1-366)" },
          { name: "isLeapYear", params: "", returns: "Bool^", desc: "Check if leap year" },
        ]}
      />

      <CodeBlock language="xxml">{`// Get current date/time
Instantiate Time::DateTime^ As <now> = Time::DateTime::now();

Run System::Console::printLine(
    String::Constructor("Date: ")
        .append(now.year().toString())
        .append(String::Constructor("-"))
        .append(now.month().toString())
        .append(String::Constructor("-"))
        .append(now.day().toString())
);

Run System::Console::printLine(
    String::Constructor("Time: ")
        .append(now.hour().toString())
        .append(String::Constructor(":"))
        .append(now.minute().toString())
        .append(String::Constructor(":"))
        .append(now.second().toString())
);`}</CodeBlock>

      <h3>Arithmetic</h3>
      <MethodTable
        methods={[
          { name: "addYears", params: "years: Integer^", returns: "DateTime^", desc: "Add years" },
          { name: "addMonths", params: "months: Integer^", returns: "DateTime^", desc: "Add months" },
          { name: "addDays", params: "days: Integer^", returns: "DateTime^", desc: "Add days" },
          { name: "addHours", params: "hours: Integer^", returns: "DateTime^", desc: "Add hours" },
          { name: "addMinutes", params: "minutes: Integer^", returns: "DateTime^", desc: "Add minutes" },
          { name: "addSeconds", params: "seconds: Integer^", returns: "DateTime^", desc: "Add seconds" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Time::DateTime^ As <now> = Time::DateTime::now();

// Add 7 days
Instantiate Time::DateTime^ As <nextWeek> = now.addDays(Integer::Constructor(7));

// Add 2 hours
Instantiate Time::DateTime^ As <later> = now.addHours(Integer::Constructor(2));

// Subtract 1 month (negative value)
Instantiate Time::DateTime^ As <lastMonth> = now.addMonths(Integer::Constructor(-1));`}</CodeBlock>

      <h3>Comparison</h3>
      <MethodTable
        methods={[
          { name: "compareTo", params: "other: DateTime^", returns: "Integer^", desc: "-1, 0, or 1" },
          { name: "equals", params: "other: DateTime^", returns: "Bool^", desc: "Test equality" },
          { name: "isBefore", params: "other: DateTime^", returns: "Bool^", desc: "Test if before" },
          { name: "isAfter", params: "other: DateTime^", returns: "Bool^", desc: "Test if after" },
        ]}
      />

      <h3>Conversion</h3>
      <MethodTable
        methods={[
          { name: "timestamp", params: "", returns: "Integer^", desc: "Get Unix timestamp (ms)" },
          { name: "format", params: "pattern: String^", returns: "String^", desc: "Format with pattern" },
          { name: "toString", params: "", returns: "String^", desc: "ISO 8601 format" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Time::DateTime^ As <now> = Time::DateTime::now();

// Format options
Run System::Console::printLine(now.format(String::Constructor("YYYY-MM-DD")));
Run System::Console::printLine(now.format(String::Constructor("HH:mm:ss")));
Run System::Console::printLine(now.format(String::Constructor("YYYY-MM-DD HH:mm:ss")));
Run System::Console::printLine(now.toString());  // ISO 8601`}</CodeBlock>

      <ClassHeader name="TimeSpan" description="Represents a duration or interval of time." />

      <h3>Static Constructors</h3>
      <MethodTable
        methods={[
          { name: "fromMilliseconds", params: "ms: Integer^", returns: "TimeSpan^", desc: "Create from ms" },
          { name: "fromSeconds", params: "sec: Integer^", returns: "TimeSpan^", desc: "Create from seconds" },
          { name: "fromMinutes", params: "min: Integer^", returns: "TimeSpan^", desc: "Create from minutes" },
          { name: "fromHours", params: "hours: Integer^", returns: "TimeSpan^", desc: "Create from hours" },
          { name: "fromDays", params: "days: Integer^", returns: "TimeSpan^", desc: "Create from days" },
        ]}
      />

      <h3>Conversion</h3>
      <MethodTable
        methods={[
          { name: "totalMilliseconds", params: "", returns: "Integer^", desc: "Get total milliseconds" },
          { name: "totalSeconds", params: "", returns: "Integer^", desc: "Get total seconds" },
          { name: "totalMinutes", params: "", returns: "Integer^", desc: "Get total minutes" },
          { name: "totalHours", params: "", returns: "Integer^", desc: "Get total hours" },
          { name: "totalDays", params: "", returns: "Integer^", desc: "Get total days" },
        ]}
      />

      <h3>Arithmetic</h3>
      <MethodTable
        methods={[
          { name: "add", params: "other: TimeSpan^", returns: "TimeSpan^", desc: "Add durations" },
          { name: "subtract", params: "other: TimeSpan^", returns: "TimeSpan^", desc: "Subtract durations" },
          { name: "multiply", params: "factor: Integer^", returns: "TimeSpan^", desc: "Multiply duration" },
          { name: "negate", params: "", returns: "TimeSpan^", desc: "Negate duration" },
          { name: "abs", params: "", returns: "TimeSpan^", desc: "Absolute value" },
        ]}
      />

      <CodeBlock language="xxml">{`// Create durations
Instantiate Time::TimeSpan^ As <oneHour> = Time::TimeSpan::fromHours(Integer::Constructor(1));
Instantiate Time::TimeSpan^ As <thirtyMin> = Time::TimeSpan::fromMinutes(Integer::Constructor(30));

// Add durations
Instantiate Time::TimeSpan^ As <total> = oneHour.add(thirtyMin);
Run System::Console::printLine(
    String::Constructor("Total minutes: ").append(total.totalMinutes().toString())
);  // 90

// Multiply
Instantiate Time::TimeSpan^ As <tripled> = thirtyMin.multiply(Integer::Constructor(3));
Run System::Console::printLine(
    String::Constructor("Tripled: ").append(tripled.totalMinutes().toString())
);  // 90`}</CodeBlock>

      <h3>Comparison</h3>
      <MethodTable
        methods={[
          { name: "compareTo", params: "other: TimeSpan^", returns: "Integer^", desc: "-1, 0, or 1" },
          { name: "equals", params: "other: TimeSpan^", returns: "Bool^", desc: "Test equality" },
          { name: "toString", params: "", returns: "String^", desc: "String representation" },
        ]}
      />

      <ClassHeader name="Timer" description="High-resolution stopwatch for measuring elapsed time." />

      <MethodTable
        methods={[
          { name: "Constructor", params: "", returns: "Timer^", desc: "Create stopped timer" },
          { name: "start", params: "", returns: "None", desc: "Start or resume timing" },
          { name: "stop", params: "", returns: "None", desc: "Stop timing" },
          { name: "reset", params: "", returns: "None", desc: "Reset to zero" },
          { name: "restart", params: "", returns: "None", desc: "Reset and start" },
          { name: "elapsedMilliseconds", params: "", returns: "Integer^", desc: "Get elapsed ms" },
          { name: "elapsedSeconds", params: "", returns: "Double^", desc: "Get elapsed seconds" },
          { name: "isRunning", params: "", returns: "Bool^", desc: "Check if running" },
        ]}
      />

      <CodeBlock language="xxml">{`Instantiate Time::Timer^ As <timer> = Time::Timer::Constructor();

Run timer.start();

// Do some work
Instantiate Integer^ As <sum> = Integer::Constructor(0);
For (Instantiate Integer^ As <i> = Integer::Constructor(0);
     i.lessThan(Integer::Constructor(100000)).toBool();
     Set i = i.add(Integer::Constructor(1)))
{
    Set sum = sum.add(i);
}

Run timer.stop();

Run System::Console::printLine(
    String::Constructor("Elapsed: ")
        .append(timer.elapsedMilliseconds().toString())
        .append(String::Constructor("ms"))
);

// Restart for another measurement
Run timer.restart();
// ... more work ...
Run timer.stop();`}</CodeBlock>

      <Callout type="info">
        Use <code>Timer</code> for benchmarking and performance profiling.
        The timer can be started, stopped, and restarted multiple times,
        accumulating elapsed time.
      </Callout>

      <h2>Complete Example</h2>
      <CodeBlock language="xxml" filename="datetime_demo.xxml" showLineNumbers>{`#import Language::Core;
#import Language::Time;
#import Language::System;

[ Entrypoint
    {
        // Current date/time
        Instantiate Time::DateTime^ As <now> = Time::DateTime::now();

        Run System::Console::printLine(String::Constructor("=== Current Date/Time ==="));
        Run System::Console::printLine(now.format(String::Constructor("YYYY-MM-DD HH:mm:ss")));

        If (now.isLeapYear().toBool())
        {
            Run System::Console::printLine(String::Constructor("This is a leap year!"));
        }

        // Calculate age from birthdate
        Instantiate Time::DateTime^ As <birthDate> = Time::DateTime::create(
            Integer::Constructor(1990),
            Integer::Constructor(6),
            Integer::Constructor(15),
            Integer::Constructor(0),
            Integer::Constructor(0),
            Integer::Constructor(0)
        );

        Instantiate Integer^ As <ageYears> = now.year().subtract(birthDate.year());
        Run System::Console::printLine(String::Constructor(""));
        Run System::Console::printLine(
            String::Constructor("Age: ").append(ageYears.toString()).append(String::Constructor(" years"))
        );

        // Calculate days until new year
        Instantiate Time::DateTime^ As <newYear> = Time::DateTime::create(
            now.year().add(Integer::Constructor(1)),
            Integer::Constructor(1),
            Integer::Constructor(1),
            Integer::Constructor(0),
            Integer::Constructor(0),
            Integer::Constructor(0)
        );

        Instantiate Integer^ As <daysUntilNewYear> = newYear.timestamp()
            .subtract(now.timestamp())
            .divide(Integer::Constructor(86400000));

        Run System::Console::printLine(String::Constructor(""));
        Run System::Console::printLine(
            String::Constructor("Days until new year: ").append(daysUntilNewYear.toString())
        );

        // Benchmark example
        Run System::Console::printLine(String::Constructor(""));
        Run System::Console::printLine(String::Constructor("=== Benchmark ==="));

        Instantiate Time::Timer^ As <timer> = Time::Timer::Constructor();
        Run timer.start();

        Instantiate Integer^ As <sum> = Integer::Constructor(0);
        For (Instantiate Integer^ As <i> = Integer::Constructor(0);
             i.lessThan(Integer::Constructor(100000)).toBool();
             Set i = i.add(Integer::Constructor(1)))
        {
            Set sum = sum.add(i);
        }

        Run timer.stop();

        Run System::Console::printLine(
            String::Constructor("Sum: ").append(sum.toString())
        );
        Run System::Console::printLine(
            String::Constructor("Time: ")
                .append(timer.elapsedMilliseconds().toString())
                .append(String::Constructor("ms"))
        );

        Exit(0);
    }
]`}</CodeBlock>

      <h2>See Also</h2>
      <div className="not-prose mt-4 flex flex-wrap gap-2">
        <a href="/docs/standard-library/system" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          System Module
        </a>
        <a href="/docs/standard-library/format" className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400">
          Format Module
        </a>
      </div>
    </>
  );
}
