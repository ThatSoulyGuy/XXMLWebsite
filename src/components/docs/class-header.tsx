interface ClassHeaderProps {
  name: string;
  description: string;
  constraints?: string | null;
}

export function ClassHeader({ name, description, constraints }: ClassHeaderProps) {
  return (
    <div className="not-prose mb-6 rounded-lg border border-zinc-200 bg-gradient-to-r from-zinc-50 to-white p-4 dark:border-zinc-700 dark:from-zinc-800/50 dark:to-zinc-900">
      <h2
        className="m-0 text-xl font-bold text-zinc-900 dark:text-zinc-100"
        id={name.toLowerCase().replace(/[<>]/g, "").replace(/\s+/g, "-")}
      >
        {name}
      </h2>
      {constraints && (
        <p className="mt-1 font-mono text-xs text-blue-600 dark:text-blue-400">
          where {constraints}
        </p>
      )}
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">{description}</p>
    </div>
  );
}
