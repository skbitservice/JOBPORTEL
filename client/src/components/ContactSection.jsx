import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="section bg-white/60 dark:bg-white/[0.03]">
      <div className="container-premium">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-100">Contact</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Questions before applying?
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Reach the hiring desk for resume updates, role fit, or interview coordination.
            </p>
          </div>
          <div className="glass grid gap-4 rounded-[2rem] p-6">
            <ContactRow icon={Phone} label="+91 99999 99999" />
            <ContactRow icon={Mail} label="careers@hirewave.local" />
            <ContactRow icon={MapPin} label="Bengaluru, Delhi NCR, Hyderabad" />
            <a className="btn-primary mt-2" href="https://wa.me/919999999999" rel="noreferrer" target="_blank">
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-4 text-sm font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100">
        <Icon size={18} />
      </span>
      {label}
    </div>
  );
}
