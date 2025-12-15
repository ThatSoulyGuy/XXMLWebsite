import Link from "next/link";
import { BookOpen, Bug, MessageSquare, Zap, Shield, Cpu, ArrowRight, Github, Terminal, Puzzle, Database, Search, Layout, Server, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-28 sm:px-6 lg:px-8 lg:py-36">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-gray-950 dark:to-slate-950" />
        <div className="grid-pattern absolute inset-0" />

        {/* Glowing orbs */}
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="absolute right-1/4 bottom-20 h-72 w-72 rounded-full bg-violet-500/20 blur-[100px]" />

        {/* Accent lines */}
        <div className="accent-line absolute left-0 right-0 top-0" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="pulse-glow inline-block h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-medium text-cyan-600 dark:text-cyan-400">Now in active development</span>
          </div>

          <h1 className="mb-8 text-5xl font-black tracking-tight sm:text-6xl lg:text-8xl">
            <span className="text-slate-900 dark:text-white">The </span>
            <span className="text-gradient glow-text-subtle">XXML</span>
            <br />
            <span className="text-slate-900 dark:text-white">Programming Language</span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg text-slate-600 dark:text-slate-300 sm:text-xl">
            A modern compiled language with explicit ownership semantics, powerful generics, and LLVM backend.
            <span className="font-semibold text-slate-900 dark:text-white"> Write safe, fast, and expressive code.</span>
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/docs"
              className="btn-futuristic glow-cyan inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-8 text-lg font-semibold text-white transition-all hover:from-cyan-400 hover:to-blue-500 hover:shadow-[0_0_40px_rgba(0,212,255,0.4)]"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://github.com/ThatSoulyGuy/XXMLCompiler"
              target="_blank"
              rel="noopener noreferrer"
              className="glass inline-flex h-14 items-center justify-center gap-2 rounded-lg px-8 text-lg font-semibold text-slate-900 transition-all hover:bg-white/20 dark:text-white dark:hover:bg-white/10"
            >
              <Github className="h-5 w-5" />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="relative overflow-hidden border-y border-cyan-500/20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-gray-950" />
        <div className="grid-pattern absolute inset-0 opacity-50" />

        <div className="relative mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Clean, <span className="text-gradient">Expressive</span> Syntax
            </h2>
            <p className="text-slate-400">Power and clarity in every line</p>
          </div>

          <div className="border-glow overflow-hidden rounded-xl bg-slate-900/80 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 border-b border-cyan-500/20 bg-slate-800/50 px-4 py-3">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-2 rounded bg-slate-700/50 px-3 py-1">
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-400">example.xxml</span>
              </div>
            </div>
            <pre className="overflow-x-auto p-6 text-sm leading-relaxed">
              <code className="text-slate-100">{`#import Language::Core;
#import Language::Collections;

[ Class <Stack> <T Constrains None> Final Extends None
    [ Private <>
        Property <items> Types Collections::List<T>^;
    ]

    [ Public <>
        Constructor Parameters() ->
        {
            Set items = Collections::List@T::Constructor();
        }

        Method <push> Returns None Parameters (Parameter <value> Types T^) Do
        {
            Run items.add(value);
        }

        Method <pop> Returns T^ Parameters () Do
        {
            Return items.removeLast();
        }
    ]
]

[ Entrypoint
    {
        Instantiate Stack<String>^ As <stack> = Stack@String::Constructor();
        Run stack.push(String::Constructor("Hello"));
        Run stack.push(String::Constructor("XXML!"));

        Run Console::printLine(stack.pop());
        Exit(0);
    }
]`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden px-4 py-28 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-slate-950" />
        <div className="grid-pattern absolute inset-0" />

        {/* Background glow */}
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black text-slate-900 dark:text-white sm:text-5xl">
              Why <span className="text-gradient">XXML</span>?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Designed for developers who demand the performance of systems programming
              with the safety and expressiveness of modern languages.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Explicit Ownership"
              description="Control memory with clear ownership semantics using ^owned, &reference, and %copy modifiers. No garbage collector, no surprises."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Powerful Generics"
              description="Write reusable code with type-safe generics and constraints. Express complex type relationships with ease."
            />
            <FeatureCard
              icon={<Cpu className="h-6 w-6" />}
              title="LLVM Backend"
              description="Compile to native code with LLVM. Get excellent performance and target multiple platforms from the same source."
            />
            <FeatureCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Rich Standard Library"
              description="Core utilities, collections, I/O, networking, and more. Everything you need to build real applications."
            />
            <FeatureCard
              icon={<Bug className="h-6 w-6" />}
              title="Compile-Time Safety"
              description="Catch errors before runtime. The type system and ownership rules prevent common bugs at compile time."
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="Active Community"
              description="Join discussions, report issues, and contribute. XXML is built by developers, for developers."
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="relative overflow-hidden border-y border-cyan-500/20 px-4 py-28 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-gray-950" />
        <div className="grid-pattern absolute inset-0 opacity-30" />

        {/* Background glow */}
        <div className="absolute right-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black text-white sm:text-5xl">
              Built for <span className="text-gradient">Real Applications</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              From high-performance services to safe plugin systems, XXML excels where explicit control matters.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <UseCaseCard
              icon={<Puzzle className="h-6 w-6" />}
              title="Safe Plugin Systems"
              description="Build extensible native apps with runtime type discovery and API versioning. No GC overhead, with full ownership guarantees for extensions."
            />
            <UseCaseCard
              icon={<Database className="h-6 w-6" />}
              title="Serialization & Data"
              description="Auto-generate serializers for JSON, RPC, save-games, and configs using reflection and compile-time code generation."
            />
            <UseCaseCard
              icon={<Search className="h-6 w-6" />}
              title="Debugging Tools"
              description="Create object inspectors, debug UIs, structured logging, and test discovery systems powered by reflection."
            />
            <UseCaseCard
              icon={<Layout className="h-6 w-6" />}
              title="Declarative DSLs"
              description="Express UI layouts, scene graphs, animation systems, asset manifests, and workflow graphs with structured syntax."
            />
            <UseCaseCard
              icon={<Server className="h-6 w-6" />}
              title="Native Services"
              description="Build backend services, daemons, and CLI tools where predictable memory and explicit ownership are essential."
            />
            <UseCaseCard
              icon={<GraduationCap className="h-6 w-6" />}
              title="Education"
              description="Learn ownership, lifetimes, and memory management through explicit, readable semantics. Perfect for teaching systems concepts."
            />
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="relative overflow-hidden px-4 py-28 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-slate-950" />
        <div className="grid-pattern absolute inset-0" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-4xl font-black text-slate-900 dark:text-white">
              Explore <span className="text-gradient">XXML</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Everything you need to get started and stay connected
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <QuickLinkCard
              href="/docs"
              icon={<BookOpen className="h-8 w-8" />}
              title="Documentation"
              description="Learn the language from the ground up with comprehensive guides and API references."
            />
            <QuickLinkCard
              href="/issues"
              icon={<Bug className="h-8 w-8" />}
              title="Issue Tracker"
              description="Report bugs, request features, and track the development progress of XXML."
            />
            <QuickLinkCard
              href="/forum"
              icon={<MessageSquare className="h-8 w-8" />}
              title="Community Forum"
              description="Ask questions, share projects, and connect with other XXML developers."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden px-4 py-32 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-slate-950" />

        {/* Dramatic glow */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500/20 to-violet-500/20 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-black text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Ready to <span className="text-gradient">dive in</span>?
          </h2>
          <p className="mb-10 text-xl text-slate-600 dark:text-slate-300">
            Start building with XXML today. The future of systems programming is here.
          </p>
          <Link
            href="/docs/getting-started"
            className="btn-futuristic glow-cyan inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-10 text-lg font-semibold text-white transition-all hover:from-cyan-400 hover:to-blue-500 hover:shadow-[0_0_50px_rgba(0,212,255,0.5)]"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="hover-lift group rounded-xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-cyan-500/50">
      <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 p-3 text-cyan-600 transition-all group-hover:from-cyan-500/30 group-hover:to-violet-500/30 group-hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] dark:text-cyan-400">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}

function UseCaseCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm transition-all hover:border-violet-500/50 hover:bg-slate-800/50">
      <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 p-3 text-violet-400 transition-all group-hover:from-violet-500/30 group-hover:to-cyan-500/30 group-hover:text-violet-300">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{description}</p>
    </div>
  );
}

function QuickLinkCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center rounded-xl border border-slate-200 bg-white/80 p-8 text-center backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] dark:border-slate-700/50 dark:bg-slate-800/50"
    >
      <div className="mb-4 text-slate-500 transition-all group-hover:text-cyan-500 group-hover:drop-shadow-[0_0_10px_rgba(0,212,255,0.5)] dark:text-slate-400 dark:group-hover:text-cyan-400">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-slate-600 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300">{description}</p>
    </Link>
  );
}
