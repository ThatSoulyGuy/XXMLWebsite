"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClass, updateClass } from "@/actions/docs";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, Save, X, ChevronDown, ChevronUp } from "lucide-react";

interface Method {
  name: string;
  category: string;
  params: string;
  returns: string;
  description: string;
  sortOrder: number;
}

interface Example {
  title: string;
  code: string;
  filename: string;
  showLines: boolean;
  sortOrder: number;
}

interface ClassEditorFormProps {
  moduleId: string;
  moduleSlug: string;
  classId?: string;
  initialData?: {
    name: string;
    slug: string;
    description: string;
    constraints: string;
    methods: Method[];
    examples: Example[];
  };
}

export function ClassEditorForm({
  moduleId,
  moduleSlug,
  classId,
  initialData,
}: ClassEditorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [constraints, setConstraints] = useState(initialData?.constraints ?? "");

  const [methods, setMethods] = useState<Method[]>(
    initialData?.methods ?? []
  );
  const [examples, setExamples] = useState<Example[]>(
    initialData?.examples ?? []
  );

  const [expandedMethods, setExpandedMethods] = useState<Set<number>>(new Set());
  const [expandedExamples, setExpandedExamples] = useState<Set<number>>(new Set());

  const addMethod = () => {
    const newIndex = methods.length;
    setMethods([
      ...methods,
      {
        name: "",
        category: "Methods",
        params: "",
        returns: "",
        description: "",
        sortOrder: methods.length,
      },
    ]);
    setExpandedMethods((prev) => new Set([...prev, newIndex]));
  };

  const updateMethod = (index: number, field: keyof Method, value: string | number) => {
    setMethods(
      methods.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const removeMethod = (index: number) => {
    setMethods(methods.filter((_, i) => i !== index));
    setExpandedMethods((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
  };

  const moveMethod = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === methods.length - 1) return;

    const newMethods = [...methods];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newMethods[index], newMethods[newIndex]] = [newMethods[newIndex], newMethods[index]];
    setMethods(newMethods);
  };

  const addExample = () => {
    const newIndex = examples.length;
    setExamples([
      ...examples,
      {
        title: "",
        code: "",
        filename: "",
        showLines: false,
        sortOrder: examples.length,
      },
    ]);
    setExpandedExamples((prev) => new Set([...prev, newIndex]));
  };

  const updateExample = (index: number, field: keyof Example, value: string | boolean | number) => {
    setExamples(
      examples.map((e, i) => (i === index ? { ...e, [field]: value } : e))
    );
  };

  const removeExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
    setExpandedExamples((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
  };

  const toggleMethodExpanded = (index: number) => {
    setExpandedMethods((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const toggleExampleExpanded = (index: number) => {
    setExpandedExamples((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const data = {
      name,
      slug,
      description,
      constraints: constraints || undefined,
      moduleId,
      sortOrder: 0,
      methods: methods.map((m, i) => ({ ...m, sortOrder: i })),
      examples: examples.map((e, i) => ({
        ...e,
        title: e.title || undefined,
        filename: e.filename || undefined,
        sortOrder: i,
      })),
    };

    startTransition(async () => {
      const result = classId
        ? await updateClass(classId, data)
        : await createClass(data);

      if (result.error) {
        setError(result.error);
      } else {
        router.push(`/docs/standard-library/${moduleSlug}/${slug}`);
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Class Information */}
      <section className="space-y-4 rounded-lg border border-zinc-200 p-6 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Class Information
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Integer, List<T>"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              placeholder="e.g., integer, list-t"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief description of what this class does"
            rows={2}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Type Constraints
          </label>
          <input
            type="text"
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="e.g., T: Hashable, Equatable"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Generic type constraints (leave empty for non-generic classes)
          </p>
        </div>
      </section>

      {/* Methods */}
      <section className="space-y-4 rounded-lg border border-zinc-200 p-6 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Methods ({methods.length})
          </h2>
          <Button type="button" onClick={addMethod} variant="outline" size="sm">
            <Plus className="mr-1 h-4 w-4" /> Add Method
          </Button>
        </div>

        {methods.length === 0 ? (
          <p className="text-sm italic text-zinc-500 dark:text-zinc-400">
            No methods yet. Click &quot;Add Method&quot; to add one.
          </p>
        ) : (
          <div className="space-y-3">
            {methods.map((method, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 dark:border-zinc-700"
              >
                <div
                  className="flex cursor-pointer items-center justify-between bg-zinc-50 px-4 py-2 dark:bg-zinc-800"
                  onClick={() => toggleMethodExpanded(index)}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-zinc-400" />
                    <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                      {method.name || "(unnamed)"}
                    </span>
                    <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                      {method.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveMethod(index, "up");
                      }}
                      disabled={index === 0}
                      className="rounded p-1 hover:bg-zinc-200 disabled:opacity-30 dark:hover:bg-zinc-700"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveMethod(index, "down");
                      }}
                      disabled={index === methods.length - 1}
                      className="rounded p-1 hover:bg-zinc-200 disabled:opacity-30 dark:hover:bg-zinc-700"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMethod(index);
                      }}
                      className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {expandedMethods.has(index) && (
                  <div className="space-y-3 p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          Name
                        </label>
                        <input
                          type="text"
                          value={method.name}
                          onChange={(e) => updateMethod(index, "name", e.target.value)}
                          placeholder="e.g., add, Constructor"
                          className="w-full rounded border border-zinc-200 bg-white px-2 py-1.5 text-sm font-mono text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          Category
                        </label>
                        <input
                          type="text"
                          value={method.category}
                          onChange={(e) => updateMethod(index, "category", e.target.value)}
                          placeholder="e.g., Constructors, Methods"
                          className="w-full rounded border border-zinc-200 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          Parameters
                        </label>
                        <input
                          type="text"
                          value={method.params}
                          onChange={(e) => updateMethod(index, "params", e.target.value)}
                          placeholder="e.g., other: Integer&"
                          className="w-full rounded border border-zinc-200 bg-white px-2 py-1.5 text-sm font-mono text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          Returns
                        </label>
                        <input
                          type="text"
                          value={method.returns}
                          onChange={(e) => updateMethod(index, "returns", e.target.value)}
                          placeholder="e.g., Integer^"
                          className="w-full rounded border border-zinc-200 bg-white px-2 py-1.5 text-sm font-mono text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        Description
                      </label>
                      <input
                        type="text"
                        value={method.description}
                        onChange={(e) => updateMethod(index, "description", e.target.value)}
                        placeholder="Brief description of what this method does"
                        className="w-full rounded border border-zinc-200 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Examples */}
      <section className="space-y-4 rounded-lg border border-zinc-200 p-6 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Code Examples ({examples.length})
          </h2>
          <Button type="button" onClick={addExample} variant="outline" size="sm">
            <Plus className="mr-1 h-4 w-4" /> Add Example
          </Button>
        </div>

        {examples.length === 0 ? (
          <p className="text-sm italic text-zinc-500 dark:text-zinc-400">
            No examples yet. Click &quot;Add Example&quot; to add one.
          </p>
        ) : (
          <div className="space-y-3">
            {examples.map((example, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 dark:border-zinc-700"
              >
                <div
                  className="flex cursor-pointer items-center justify-between bg-zinc-50 px-4 py-2 dark:bg-zinc-800"
                  onClick={() => toggleExampleExpanded(index)}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {example.title || example.filename || `Example ${index + 1}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExample(index);
                      }}
                      className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {expandedExamples.has(index) && (
                  <div className="space-y-3 p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          Title
                        </label>
                        <input
                          type="text"
                          value={example.title}
                          onChange={(e) => updateExample(index, "title", e.target.value)}
                          placeholder="Optional title"
                          className="w-full rounded border border-zinc-200 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          Filename
                        </label>
                        <input
                          type="text"
                          value={example.filename}
                          onChange={(e) => updateExample(index, "filename", e.target.value)}
                          placeholder="e.g., example.xxml"
                          className="w-full rounded border border-zinc-200 bg-white px-2 py-1.5 text-sm font-mono text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        Code
                      </label>
                      <textarea
                        value={example.code}
                        onChange={(e) => updateExample(index, "code", e.target.value)}
                        placeholder="XXML code example"
                        rows={8}
                        className="w-full rounded border border-zinc-200 bg-white px-2 py-1.5 font-mono text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <input
                        type="checkbox"
                        checked={example.showLines}
                        onChange={(e) => updateExample(index, "showLines", e.target.checked)}
                        className="rounded border-zinc-300 dark:border-zinc-600"
                      />
                      Show line numbers
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isPending}
        >
          <X className="mr-1 h-4 w-4" /> Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          <Save className="mr-1 h-4 w-4" />
          {isPending ? "Saving..." : classId ? "Save Changes" : "Create Class"}
        </Button>
      </div>
    </form>
  );
}
