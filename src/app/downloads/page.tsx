import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ManagementButton } from "@/components/content/management-button";
import { Plus, Download, Apple, Monitor, Terminal, Package } from "lucide-react";

const EDITOR_ROLES = ["DEVELOPER", "ADMIN"];

export const metadata = {
  title: "Downloads",
  description: "Download XXML compiler and tools",
};

function getPlatformIcon(platform: string) {
  switch (platform) {
    case "WINDOWS":
      return <Monitor className="h-6 w-6" />;
    case "MACOS":
      return <Apple className="h-6 w-6" />;
    case "LINUX":
      return <Terminal className="h-6 w-6" />;
    default:
      return <Package className="h-6 w-6" />;
  }
}

function getPlatformName(platform: string) {
  switch (platform) {
    case "WINDOWS":
      return "Windows";
    case "MACOS":
      return "macOS";
    case "LINUX":
      return "Linux";
    case "ALL":
      return "All Platforms";
    default:
      return platform;
  }
}

export default async function DownloadsPage() {
  const session = await auth();
  let canEdit = false;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    canEdit = user ? EDITOR_ROLES.includes(user.role) : false;
  }

  const downloads = await prisma.download.findMany({
    orderBy: [
      { isFeatured: "desc" },
      { isLatest: "desc" },
      { sortOrder: "asc" },
      { releaseDate: "desc" },
    ],
  });

  const latestDownloads = downloads.filter((d) => d.isLatest);
  const featuredDownloads = downloads.filter((d) => d.isFeatured && !d.isLatest);
  const otherDownloads = downloads.filter((d) => !d.isLatest && !d.isFeatured);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Downloads</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-300">
            Download the XXML compiler and tools for your platform
          </p>
        </div>
        {canEdit && (
          <ManagementButton>
            <Link href="/downloads/new">
              <Button>
                <Plus className="mr-1 h-4 w-4" /> Add Download
              </Button>
            </Link>
          </ManagementButton>
        )}
      </div>

      {/* Latest Releases */}
      {latestDownloads.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Latest Release
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestDownloads.map((download) => (
              <div
                key={download.id}
                className="group relative rounded-xl border border-zinc-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-6 transition-all hover:shadow-lg dark:border-zinc-700 dark:from-cyan-900/20 dark:to-blue-900/20"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400">
                    {getPlatformIcon(download.platform)}
                  </div>
                  <span className="rounded-full bg-cyan-500 px-2.5 py-0.5 text-xs font-medium text-white">
                    Latest
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {download.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {getPlatformName(download.platform)} &bull; v{download.version}
                </p>
                <p className="mt-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
                  {download.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  {download.fileSize && (
                    <span className="text-xs text-zinc-500">{download.fileSize}</span>
                  )}
                  <a
                    href={download.fileUrl}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-500"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </div>
                {canEdit && (
                  <ManagementButton>
                    <Link
                      href={`/downloads/${download.slug}/edit`}
                      className="absolute right-2 top-2 rounded bg-zinc-200 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300"
                    >
                      Edit
                    </Link>
                  </ManagementButton>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Downloads */}
      {featuredDownloads.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Featured
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDownloads.map((download) => (
              <div
                key={download.id}
                className="group relative rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                    {getPlatformIcon(download.platform)}
                  </div>
                  <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-medium text-white">
                    Featured
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {download.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {getPlatformName(download.platform)} &bull; v{download.version}
                </p>
                <p className="mt-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
                  {download.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  {download.fileSize && (
                    <span className="text-xs text-zinc-500">{download.fileSize}</span>
                  )}
                  <a
                    href={download.fileUrl}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-500"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </div>
                {canEdit && (
                  <ManagementButton>
                    <Link
                      href={`/downloads/${download.slug}/edit`}
                      className="absolute right-2 top-2 rounded bg-zinc-200 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300"
                    >
                      Edit
                    </Link>
                  </ManagementButton>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other Downloads */}
      {otherDownloads.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            All Downloads
          </h2>
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
            {otherDownloads.map((download, index) => (
              <div
                key={download.id}
                className={`relative flex items-center justify-between p-4 ${
                  index !== otherDownloads.length - 1
                    ? "border-b border-zinc-200 dark:border-zinc-700"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                    {getPlatformIcon(download.platform)}
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                      {download.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {getPlatformName(download.platform)} &bull; v{download.version}
                      {download.fileSize && ` &bull; ${download.fileSize}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <ManagementButton>
                      <Link
                        href={`/downloads/${download.slug}/edit`}
                        className="rounded bg-zinc-200 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300"
                      >
                        Edit
                      </Link>
                    </ManagementButton>
                  )}
                  <a
                    href={download.fileUrl}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {downloads.length === 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-800">
          <Package className="mx-auto h-12 w-12 text-zinc-400" />
          <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
            No downloads available
          </h3>
          <p className="mt-2 text-zinc-500 dark:text-zinc-300">
            Check back soon for XXML releases.
          </p>
          {canEdit && (
            <Link href="/downloads/new">
              <Button className="mt-4">
                <Plus className="mr-1 h-4 w-4" /> Add Download
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
