import { ArrowRight, BadgeCheck, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { stats } from "../data.js";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[88vh] overflow-hidden bg-slate-950 text-white">
      <img
        alt="Hiring team reviewing candidates in a bright modern office"
        className="absolute inset-0 h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=2200&q=85"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,18,22,0.9),rgba(7,18,22,0.54),rgba(7,18,22,0.22))]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f7fbf8] to-transparent dark:from-[#0d1416]" />

      <div className="container-premium relative flex min-h-[88vh] items-center px-5 pt-28 sm:px-8 lg:px-10">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl pb-20"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-bold backdrop-blur-md">
            <Sparkles size={16} />
            Premium hiring experience for modern teams
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
            HireWave Careers
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100 sm:text-xl">
            Apply with your resume, verify your mobile number, and get a professional application ID in one polished flow.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="btn-primary text-base" href="#apply">
              Start Application
              <ArrowRight size={19} />
            </a>
            <a className="btn-secondary border-white/20 bg-white/12 text-white hover:text-white" href="#jobs">
              View Open Roles
            </a>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div className="rounded-3xl border border-white/16 bg-white/12 p-4 backdrop-blur-md" key={stat.label}>
                <div className="font-display text-2xl font-bold">{stat.value}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-6 hidden w-80 rounded-3xl border border-white/20 bg-white/14 p-5 text-white shadow-premium backdrop-blur-xl lg:block">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500">
            <BadgeCheck size={22} />
          </span>
          <div>
            <p className="font-bold">Smart candidate intake</p>
            <p className="text-sm text-slate-200">Secure uploads, email alerts, and admin review.</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
          <MapPin size={16} />
          Location-aware applicant filtering
        </div>
      </div>
    </section>
  );
}
