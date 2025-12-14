interface Method {
  name: string;
  params: string;
  returns: string;
  description: string;
}

interface MethodTableProps {
  methods: Method[];
  title?: string;
}

export function MethodTable({ methods, title }: MethodTableProps) {
  return (
    <>
      {title && <h3>{title}</h3>}
      <div className="not-prose my-4 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-100">
                Method
              </th>
              <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-100">
                Parameters
              </th>
              <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-100">
                Returns
              </th>
              <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-100">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {methods.map((m, i) => (
              <tr
                key={`${m.name}-${i}`}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <td className="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">
                  {m.name}
                </td>
                <td className="px-4 py-2 font-mono text-zinc-600 dark:text-zinc-300">
                  {m.params || "—"}
                </td>
                <td className="px-4 py-2 font-mono text-zinc-600 dark:text-zinc-300">
                  {m.returns}
                </td>
                <td className="px-4 py-2 text-zinc-500 dark:text-zinc-400">
                  {m.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
