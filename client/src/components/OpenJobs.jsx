import { ArrowUpRight, Briefcase, Clock, MapPin } from "lucide-react";
import { openJobs } from "../data.js";

export default function OpenJobs() {
  return (
    <section id="jobs" className="section">
      <div className="container-premium">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-100">Open jobs</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Roles ready for standout applicants.
            </h2>
          </div>
          <a className="btn-secondary w-fit" href="#apply">
            Submit general application
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {openJobs.map((job) => (
            <article className="glass rounded-3xl p-6 transition hover:-translate-y-1" key={job.title}>
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white">
                  <Briefcase size={22} />
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-brand-700 shadow-sm dark:bg-white/10 dark:text-brand-100">
                  {job.type}
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-bold text-slate-950 dark:text-white">{job.title}</h3>
              <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {job.location}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {job.experience}
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800 dark:bg-brand-500/10 dark:text-brand-100" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
