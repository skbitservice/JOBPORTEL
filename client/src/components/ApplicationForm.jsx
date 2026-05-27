import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CloudUpload, FileUp, ImagePlus, KeyRound, Send } from "lucide-react";
import { api } from "../lib/api.js";
import MapsPicker from "./MapsPicker.jsx";

const initialForm = {
  fullName: "",
  mobile: "",
  email: "",
  fullAddress: "",
  city: "",
  state: "",
  pincode: "",
  currentLocation: { label: "", lat: null, lng: null },
  skills: "",
  experience: ""
};

const validate = (form, resume) => {
  const required = ["fullName", "mobile", "email", "fullAddress", "city", "state", "pincode", "skills", "experience"];
  const missing = required.find((field) => !String(form[field]).trim());
  if (missing) {
    return "Please complete all required fields.";
  }

  if (!/^\+?[0-9]{10,15}$/.test(form.mobile.replace(/\s|-/g, ""))) {
    return "Enter a valid mobile number with 10 to 15 digits.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    return "Enter a valid email address.";
  }

  if (Number.isNaN(Number(form.experience)) || Number(form.experience) < 0) {
    return "Experience must be a valid number.";
  }

  if (!resume) {
    return "Please upload your CV or resume.";
  }

  return "";
};

export default function ApplicationForm() {
  const [form, setForm] = useState(initialForm);
  const [resume, setResume] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const mobileClean = useMemo(() => form.mobile.replace(/\s|-/g, ""), [form.mobile]);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === "mobile") {
      setOtpVerified(false);
      setOtpSent(false);
      setDevOtp("");
    }
  };

  const sendOtp = async () => {
    setMessage("");
    if (!/^\+?[0-9]{10,15}$/.test(mobileClean)) {
      setMessage("Enter a valid mobile number before requesting OTP.");
      return;
    }

    try {
      const { data } = await api.post("/otp/send", { mobile: mobileClean });
      setOtpSent(true);
      setDevOtp(data.devOtp || "");
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not send OTP.");
    }
  };

  const verifyOtp = async () => {
    setMessage("");
    try {
      const { data } = await api.post("/otp/verify", { mobile: mobileClean, otp });
      setOtpVerified(Boolean(data.verified));
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not verify OTP.");
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");

    const validationMessage = validate(form, resume);
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    if (!otpVerified) {
      setMessage("Please verify your mobile number before submitting.");
      return;
    }

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      payload.append(key, key === "currentLocation" ? JSON.stringify(value) : value);
    });
    payload.append("resume", resume);
    if (photo) {
      payload.append("photo", photo);
    }

    setLoading(true);
    try {
      const { data } = await api.post("/applications", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSuccess(data);
      setForm(initialForm);
      setResume(null);
      setPhoto(null);
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
      setDevOtp("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Application could not be submitted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="apply" className="section bg-white/60 dark:bg-white/[0.03]">
      <div className="container-premium">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-100">
              Upload resume
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Apply once. Make the first impression count.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Share your profile, verify your mobile number, and upload your latest CV. The hiring team receives your
              details automatically.
            </p>
            <div className="mt-8 grid gap-4">
              {["PDF, DOC, DOCX resume support", "Profile photo upload", "Admin email with attachments"].map((item) => (
                <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200" key={item}>
                  <CheckCircle2 className="text-brand-600 dark:text-brand-100" size={20} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <motion.form
            className="glass rounded-[2rem] p-5 sm:p-7"
            initial={{ opacity: 0, y: 16 }}
            onSubmit={submit}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="fullName">
                  Full Name
                </label>
                <input className="field" id="fullName" onChange={(e) => update("fullName", e.target.value)} value={form.fullName} />
              </div>
              <div>
                <label className="label" htmlFor="email">
                  Email Address
                </label>
                <input className="field" id="email" onChange={(e) => update("email", e.target.value)} type="email" value={form.email} />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="mobile">
                  Mobile Number
                </label>
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <input
                    className="field"
                    id="mobile"
                    onChange={(e) => update("mobile", e.target.value)}
                    placeholder="+919876543210"
                    value={form.mobile}
                  />
                  <button className="btn-secondary" onClick={sendOtp} type="button">
                    <KeyRound size={18} />
                    Send OTP
                  </button>
                </div>
                {otpSent && (
                  <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
                    <input
                      className="field"
                      maxLength={6}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                    />
                    <button className="btn-primary" onClick={verifyOtp} type="button">
                      Verify
                    </button>
                  </div>
                )}
                {devOtp && (
                  <p className="mt-2 inline-flex rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-slate-700 dark:text-gold">
                    Development OTP: {devOtp}
                  </p>
                )}
                {otpVerified && <p className="mt-2 text-sm font-bold text-brand-700 dark:text-brand-100">Mobile verified.</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="fullAddress">
                  Full Address
                </label>
                <textarea
                  className="field min-h-28 resize-y"
                  id="fullAddress"
                  onChange={(e) => update("fullAddress", e.target.value)}
                  value={form.fullAddress}
                />
              </div>
              <div>
                <label className="label" htmlFor="city">
                  City
                </label>
                <input className="field" id="city" onChange={(e) => update("city", e.target.value)} value={form.city} />
              </div>
              <div>
                <label className="label" htmlFor="state">
                  State
                </label>
                <input className="field" id="state" onChange={(e) => update("state", e.target.value)} value={form.state} />
              </div>
              <div>
                <label className="label" htmlFor="pincode">
                  Pincode
                </label>
                <input className="field" id="pincode" onChange={(e) => update("pincode", e.target.value)} value={form.pincode} />
              </div>
              <div>
                <label className="label" htmlFor="experience">
                  Experience
                </label>
                <input
                  className="field"
                  id="experience"
                  min="0"
                  onChange={(e) => update("experience", e.target.value)}
                  placeholder="Years"
                  type="number"
                  value={form.experience}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="skills">
                  Skills
                </label>
                <input
                  className="field"
                  id="skills"
                  onChange={(e) => update("skills", e.target.value)}
                  placeholder="React, Node.js, Hiring, Sales"
                  value={form.skills}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Current Location</label>
                <MapsPicker value={form.currentLocation} onChange={(value) => update("currentLocation", value)} />
              </div>
              <FileInput
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                file={resume}
                icon={FileUp}
                label="CV / Resume"
                onChange={setResume}
                required
              />
              <FileInput accept="image/png,image/jpeg,image/webp" file={photo} icon={ImagePlus} label="Profile Photo" onChange={setPhoto} />
            </div>

            {message && (
              <div className="mt-5 rounded-2xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm font-bold text-slate-700 dark:text-coral">
                {message}
              </div>
            )}

            <button className="btn-primary mt-7 w-full text-base" disabled={loading} type="submit">
              {loading ? <span className="spinner" /> : <Send size={19} />}
              {loading ? "Submitting Application..." : "Submit Application"}
            </button>
          </motion.form>
        </div>
      </div>

      {success && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="glass max-w-md rounded-[2rem] p-7 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-500 text-white">
              <CheckCircle2 size={34} />
            </div>
            <h3 className="mt-5 font-display text-2xl font-bold text-slate-950 dark:text-white">Application submitted</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Your application ID is <strong>{success.applicationId}</strong>. A confirmation email has been prepared.
            </p>
            <button className="btn-primary mt-6 w-full" onClick={() => setSuccess(null)} type="button">
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function FileInput({ accept, file, icon: Icon, label, onChange, required = false }) {
  return (
    <div>
      <label className="label">
        {label}
        {required ? " *" : ""}
      </label>
      <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-brand-500/40 bg-brand-50/70 p-5 text-center transition hover:-translate-y-0.5 hover:bg-brand-50 dark:bg-brand-500/10">
        <CloudUpload className="text-brand-700 dark:text-brand-100" size={30} />
        <span className="mt-3 text-sm font-bold text-slate-800 dark:text-white">{file ? file.name : `Upload ${label}`}</span>
        <span className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Max 8 MB</span>
        <input accept={accept} className="sr-only" onChange={(event) => onChange(event.target.files?.[0] || null)} type="file" />
      </label>
    </div>
  );
}
