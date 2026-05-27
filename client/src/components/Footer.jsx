import { BriefcaseBusiness } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-5 py-10 sm:px-8 lg:px-10">
      <div className="container-premium flex flex-col justify-between gap-5 border-t border-slate-200 pt-8 dark:border-white/10 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-600 text-white">
            <BriefcaseBusiness size={22} />
          </span>
          <div>
            <p className="font-display font-bold">HireWave Careers</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Premium recruitment application platform.</p>
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} HireWave. Built for secure candidate intake.
        </p>
      </div>
    </footer>
  );
}
