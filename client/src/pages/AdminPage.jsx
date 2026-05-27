import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  LockKeyhole,
  LogOut,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  UserRoundCheck
} from "lucide-react";
import { api, downloadBlob, setAuthToken } from "../lib/api.js";

const emptyFilters = {
  search: "",
  location: "",
  skill: "",
  experienceMin: "",
  experienceMax: ""
};

export default function AdminPage({ theme, toggleTheme }) {
  const [token, setToken] = useState(localStorage.getItem("hirewave-admin-token") || "");
  const [login, setLogin] = useState({ email: "", password: "" });
  const [filters, setFilters] = useState(emptyFilters);
  const [applicants, setApplicants] = useState([]);
  const [stats, setStats] = useState({ total: 0, avgExperience: 0, shortlisted: 0 });
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    return params.toString();
  }, [filters]);

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem("hirewave-admin-token", token);
      fetchApplicants();
    }
  }, [token, query]);

  const fetchApplicants = async () => {
    setLoading(true);
    setMessage("");
    try {
      const { data } = await api.get(`/admin/applicants?${query}`);
      setApplicants(data.items);
      setStats(data.stats);
      setTotal(data.total);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not load applicants.");
    } finally {
      setLoading(false);
    }
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const { data } = await api.post("/admin/login", login);
      setToken(data.token);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setAuthToken("");
    localStorage.removeItem("hirewave-admin-token");
  };

  const exportFile = async (type) => {
    setMessage("");
    try {
      await downloadBlob({
        token,
        url: `/admin/applicants/export/${type}?${query}`,
        filename: type === "excel" ? "applicants.xlsx" : "applicants.pdf"
      });
    } catch (error) {
      setMessage(error.message);
    }
  };

  const downloadApplicantFile = (applicant, kind) =>
    downloadBlob({
      token,
      url: `/applications/${applicant.id}/file/${kind}`,
      filename: `${applicant.applicationId}-${kind}`
    });

  if (!token) {
    return (
      <main className="min-h-screen bg-[#f7fbf8] px-5 py-8 dark:bg-[#0d1416]">
        <div className="mx-auto flex max-w-md flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link className="btn-secondary" to="/">
              <ArrowLeft size={18} />
              Home
            </Link>
            <button aria-label="Toggle dark mode" className="btn-secondary !px-3" onClick={toggleTheme} type="button">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <form className="glass mt-8 rounded-[2rem] p-7" onSubmit={submitLogin}>
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white">
              <LockKeyhole size={24} />
            </span>
            <h1 className="mt-6 font-display text-3xl font-bold text-slate-950 dark:text-white">Admin login</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Sign in to review applicants, filter profiles, and export hiring data.
            </p>
            <div className="mt-6 grid gap-4">
              <div>
                <label className="label" htmlFor="adminEmail">
                  Email
                </label>
                <input
                  className="field"
                  id="adminEmail"
                  onChange={(e) => setLogin((current) => ({ ...current, email: e.target.value }))}
                  type="email"
                  value={login.email}
                />
              </div>
              <div>
                <label className="label" htmlFor="adminPassword">
                  Password
                </label>
                <input
                  className="field"
                  id="adminPassword"
                  onChange={(e) => setLogin((current) => ({ ...current, password: e.target.value }))}
                  type="password"
                  value={login.password}
                />
              </div>
            </div>
            {message && <p className="mt-4 rounded-2xl bg-coral/10 px-4 py-3 text-sm font-bold text-coral">{message}</p>}
            <button className="btn-primary mt-6 w-full" disabled={loading} type="submit">
              {loading ? <span className="spinner" /> : <ShieldCheck size={18} />}
              Sign in
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7fbf8] px-5 py-6 dark:bg-[#0d1416] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="glass flex flex-col gap-4 rounded-3xl p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white">
              <UserRoundCheck size={24} />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-950 dark:text-white">Applicant Dashboard</h1>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{total} matching applicants</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="btn-secondary" to="/">
              <ArrowLeft size={18} />
              Site
            </Link>
            <button className="btn-secondary !px-3" onClick={toggleTheme} type="button">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn-secondary" onClick={logout} type="button">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <Stat label="Total applicants" value={stats.total || 0} />
          <Stat label="Average experience" value={`${Number(stats.avgExperience || 0).toFixed(1)} yrs`} />
          <Stat label="Shortlisted" value={stats.shortlisted || 0} />
        </section>

        <section className="glass mt-6 rounded-3xl p-4">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_0.7fr_0.7fr_auto]">
            <FilterInput icon={Search} label="Search" value={filters.search} onChange={(value) => setFilters({ ...filters, search: value })} />
            <FilterInput label="Location" value={filters.location} onChange={(value) => setFilters({ ...filters, location: value })} />
            <FilterInput label="Skill" value={filters.skill} onChange={(value) => setFilters({ ...filters, skill: value })} />
            <FilterInput label="Min exp" value={filters.experienceMin} onChange={(value) => setFilters({ ...filters, experienceMin: value })} />
            <FilterInput label="Max exp" value={filters.experienceMax} onChange={(value) => setFilters({ ...filters, experienceMax: value })} />
            <button className="btn-secondary" onClick={() => setFilters(emptyFilters)} type="button">
              Reset
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn-primary" onClick={() => exportFile("excel")} type="button">
              <Download size={18} />
              Excel
            </button>
            <button className="btn-secondary" onClick={() => exportFile("pdf")} type="button">
              <FileText size={18} />
              PDF
            </button>
          </div>
        </section>

        {message && <p className="mt-5 rounded-2xl bg-coral/10 px-4 py-3 text-sm font-bold text-coral">{message}</p>}

        <section className="mt-6 grid gap-4">
          {loading && <div className="glass rounded-3xl p-8 text-center font-bold">Loading applicants...</div>}
          {!loading && applicants.length === 0 && <div className="glass rounded-3xl p-8 text-center font-bold">No applicants found.</div>}
          {applicants.map((applicant) => (
            <article className="glass rounded-3xl p-5" key={applicant.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">{applicant.fullName}</h2>
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-extrabold text-brand-800 dark:bg-brand-500/10 dark:text-brand-100">
                      {applicant.applicationId}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-600 dark:bg-white/10 dark:text-slate-200">
                      {applicant.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {applicant.email} | {applicant.mobile}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {applicant.city}, {applicant.state} | {applicant.experience} years experience
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {applicant.skills.map((skill) => (
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {applicant.hasResume && (
                    <button className="btn-secondary" onClick={() => downloadApplicantFile(applicant, "resume")} type="button">
                      Resume
                    </button>
                  )}
                  {applicant.hasPhoto && (
                    <button className="btn-secondary" onClick={() => downloadApplicantFile(applicant, "photo")} type="button">
                      Photo
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="glass rounded-3xl p-5">
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function FilterInput({ icon: Icon, label, value, onChange }) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />}
        <input
          className={`field ${Icon ? "pl-11" : ""}`}
          onChange={(event) => onChange(event.target.value)}
          placeholder={label}
          value={value}
        />
      </div>
    </label>
  );
}
