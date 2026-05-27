import { useState } from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, Menu, Moon, ShieldCheck, Sun, X } from "lucide-react";

const links = [
  { href: "#about", label: "About" },
  { href: "#apply", label: "Apply" },
  { href: "#jobs", label: "Jobs" },
  { href: "#contact", label: "Contact" }
];

export default function Navbar({ theme, toggleTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-3xl px-4 py-3">
        <a href="#home" className="flex items-center gap-3" aria-label="HireWave home">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-600 text-white shadow-soft">
            <BriefcaseBusiness size={22} />
          </span>
          <span>
            <span className="block font-display text-lg font-bold leading-none">HireWave</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Careers Portal</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a className="nav-link" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            aria-label="Toggle dark mode"
            className="btn-secondary !rounded-full !px-3"
            onClick={toggleTheme}
            type="button"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/admin" className="btn-secondary">
            <ShieldCheck size={18} />
            Admin
          </Link>
          <a href="#apply" className="btn-primary">
            Apply Now
          </a>
        </div>

        <button
          aria-label="Open navigation menu"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-800 lg:hidden dark:border-white/10 dark:bg-white/10 dark:text-white"
          onClick={() => setOpen(true)}
          type="button"
        >
          <Menu size={22} />
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 p-4 backdrop-blur-sm lg:hidden">
          <div className="glass ml-auto flex h-full max-w-sm flex-col rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-bold">HireWave</span>
              <button
                aria-label="Close navigation menu"
                className="grid h-10 w-10 place-items-center rounded-2xl bg-white/80 dark:bg-white/10"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-8 grid gap-2">
              {links.map((link) => (
                <a
                  className="rounded-2xl px-4 py-3 text-base font-bold hover:bg-brand-50 dark:hover:bg-white/10"
                  href={link.href}
                  key={link.href}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link
                className="rounded-2xl px-4 py-3 text-base font-bold hover:bg-brand-50 dark:hover:bg-white/10"
                onClick={() => setOpen(false)}
                to="/admin"
              >
                Admin Dashboard
              </Link>
            </div>
            <div className="mt-auto grid gap-3">
              <button className="btn-secondary w-full" onClick={toggleTheme} type="button">
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
              <a className="btn-primary w-full" href="#apply" onClick={() => setOpen(false)}>
                Apply Now
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
