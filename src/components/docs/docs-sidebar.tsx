"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { docsNavigation, type NavSection, type NavItem } from "@/lib/docs-navigation";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface DocModule {
  id: string;
  slug: string;
  name: string;
  classes: {
    id: string;
    slug: string;
    name: string;
  }[];
}

function NavLink({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const [isOpen, setIsOpen] = useState(pathname.startsWith(item.href));

  if (item.items) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          )}
        >
          <span>{item.title}</span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {isOpen && (
          <div className="ml-3 mt-1 space-y-1 border-l border-zinc-200 pl-3 dark:border-zinc-700">
            {item.items.map((subItem) => (
              <NavLink key={subItem.href} item={subItem} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      )}
    >
      <span>{item.title}</span>
      {item.badge && (
        <Badge variant="primary" className="text-[10px]">
          {item.badge}
        </Badge>
      )}
    </Link>
  );
}

function ModuleTree({ module }: { module: DocModule }) {
  const pathname = usePathname();
  const moduleBasePath = `/docs/standard-library/${module.slug}`;
  const isInModule = pathname.startsWith(moduleBasePath);
  const [isOpen, setIsOpen] = useState(isInModule);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isInModule
            ? "bg-blue-50/50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
        )}
      >
        <span>{module.name}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {isOpen && module.classes.length > 0 && (
        <div className="ml-3 mt-1 space-y-1 border-l border-zinc-200 pl-3 dark:border-zinc-700">
          {module.classes.map((cls) => {
            const classHref = `${moduleBasePath}/${cls.slug}`;
            const isActive = pathname === classHref;
            return (
              <Link
                key={cls.id}
                href={classHref}
                className={cn(
                  "block rounded-lg px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                )}
              >
                {cls.name}
              </Link>
            );
          })}
        </div>
      )}
      {isOpen && module.classes.length === 0 && (
        <div className="ml-3 mt-1 border-l border-zinc-200 pl-3 dark:border-zinc-700">
          <span className="block px-3 py-1.5 text-sm italic text-zinc-400 dark:text-zinc-500">
            No classes yet
          </span>
        </div>
      )}
    </div>
  );
}

function StandardLibrarySection({ modules }: { modules: DocModule[] }) {
  const pathname = usePathname();
  const overviewHref = "/docs/standard-library";
  const isOverviewActive = pathname === overviewHref;

  return (
    <div className="space-y-1">
      <h4 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        Standard Library
      </h4>
      <div className="space-y-1">
        <Link
          href={overviewHref}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
            isOverviewActive
              ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          )}
        >
          Overview
        </Link>
        {modules.map((module) => (
          <ModuleTree key={module.id} module={module} />
        ))}
      </div>
    </div>
  );
}

function NavSectionComponent({ section }: { section: NavSection }) {
  return (
    <div className="space-y-1">
      <h4 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {section.title}
      </h4>
      <div className="space-y-1">
        {section.items.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>
    </div>
  );
}

export function DocsSidebar() {
  const pathname = usePathname();
  const [modules, setModules] = useState<DocModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refetch modules when pathname changes (e.g., after creating new content)
  useEffect(() => {
    // Don't show loading spinner on refetch, only on initial load
    if (modules.length === 0) {
      setLoading(true);
    }

    fetch("/api/docs/modules")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setModules(data);
        } else if (data.error) {
          setError(data.error);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch modules:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [pathname]);

  // Filter out the Standard Library section from static navigation
  const staticSections = docsNavigation.filter(
    (section) => section.title !== "Standard Library"
  );

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-white/20 bg-white/40 py-8 pr-4 backdrop-blur-xl lg:block dark:border-white/10 dark:bg-zinc-900/40">
      <nav className="space-y-6">
        {staticSections.map((section) => (
          <NavSectionComponent key={section.title} section={section} />
        ))}

        {loading ? (
          <div className="space-y-1">
            <h4 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Standard Library
            </h4>
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          </div>
        ) : error ? (
          <div className="space-y-1">
            <h4 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Standard Library
            </h4>
            <div className="px-3 py-2 text-sm text-red-500">
              Error: {error}
            </div>
          </div>
        ) : (
          <StandardLibrarySection modules={modules} />
        )}
      </nav>
    </aside>
  );
}
