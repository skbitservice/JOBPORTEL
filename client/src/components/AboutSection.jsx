import { ClipboardCheck, FileText, LockKeyhole, MailCheck } from "lucide-react";

const items = [
  {
    icon: ClipboardCheck,
    title: "Guided application",
    text: "Candidates complete a clean form with validation, OTP verification, and instant confirmation."
  },
  {
    icon: LockKeyhole,
    title: "Secure intake",
    text: "Files are validated, applicant records are stored in MongoDB, and admin access is authenticated."
  },
  {
    icon: MailCheck,
    title: "Automatic alerts",
    text: "Admin receives the applicant profile and attachments while candidates receive a confirmation email."
  },
  {
    icon: FileText,
    title: "Admin-ready exports",
    text: "Download filtered applicant data as Excel or PDF for offline screening and reporting."
  }
];

export default function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="container-premium">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-100">About us</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              A sharper way to collect and review job applications.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
              HireWave keeps the candidate journey simple while giving hiring teams the controls they expect: location
              context, skills filtering, protected files, and exportable applicant data.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <div className="glass rounded-3xl p-6 transition hover:-translate-y-1" key={item.title}>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100">
                  <item.icon size={22} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
