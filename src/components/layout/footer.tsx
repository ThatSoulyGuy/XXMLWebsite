import Link from "next/link";
import { Github } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Documentation", href: "/docs" },
    { name: "Getting Started", href: "/docs/getting-started" },
    { name: "Examples", href: "/docs/examples" },
    { name: "Changelog", href: "/blog" },
  ],
  community: [
    { name: "Forum", href: "/forum" },
    { name: "Issues", href: "/issues" },
    { name: "GitHub", href: "https://github.com/ThatSoulyGuy/XXMLCompiler" },
  ],
  resources: [
    { name: "Language Reference", href: "/docs/language-reference" },
    { name: "Standard Library", href: "/docs/standard-library" },
    { name: "Blog", href: "/blog" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-cyan-500/20 bg-slate-50 dark:bg-slate-950">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="group flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 transition-shadow group-hover:shadow-[0_0_15px_rgba(0,212,255,0.5)]">
                <span className="text-sm font-bold text-white">X</span>
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white">XXML</span>
            </Link>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              A modern compiled programming language with LLVM backend, explicit ownership semantics, and powerful generics.
            </p>
            <div className="mt-4 flex gap-4">
              <a
                href="https://github.com/ThatSoulyGuy/XXMLCompiler"
                className="text-slate-500 transition-all hover:text-cyan-500 hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.5)] dark:text-slate-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Product</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-cyan-500 dark:text-slate-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Community</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-cyan-500 dark:text-slate-400"
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Resources</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-cyan-500 dark:text-slate-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-cyan-500 dark:text-slate-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-cyan-500/20 pt-8">
          <p className="text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} XXML Programming Language. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
