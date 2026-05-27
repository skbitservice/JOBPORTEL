import nodemailer from "nodemailer";

let cachedTransporter;

const getTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  if (!process.env.SMTP_HOST) {
    cachedTransporter = nodemailer.createTransport({ jsonTransport: true });
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      : undefined
  });

  return cachedTransporter;
};

const from = () => process.env.SMTP_FROM || "HireWave Careers <no-reply@hirewave.local>";

export const sendAdminApplicantEmail = async (applicant) => {
  const to = process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL;
  if (!to) {
    console.warn("No admin notification email configured.");
    return false;
  }

  const attachments = [];
  if (applicant.files?.resume?.path) {
    attachments.push({
      filename: applicant.files.resume.originalName,
      path: applicant.files.resume.path
    });
  }
  if (applicant.files?.photo?.path) {
    attachments.push({
      filename: applicant.files.photo.originalName,
      path: applicant.files.photo.path
    });
  }

  const info = await getTransporter().sendMail({
    from: from(),
    to,
    subject: `New job application: ${applicant.fullName} (${applicant.applicationId})`,
    html: `
      <h2>New Candidate Application</h2>
      <p><strong>Application ID:</strong> ${applicant.applicationId}</p>
      <p><strong>Name:</strong> ${applicant.fullName}</p>
      <p><strong>Mobile:</strong> ${applicant.mobile}</p>
      <p><strong>Email:</strong> ${applicant.email}</p>
      <p><strong>Location:</strong> ${applicant.city}, ${applicant.state}</p>
      <p><strong>Current Location:</strong> ${applicant.currentLocation?.label || "Not provided"}</p>
      <p><strong>Experience:</strong> ${applicant.experience} years</p>
      <p><strong>Skills:</strong> ${applicant.skills.join(", ")}</p>
      <p><strong>Address:</strong> ${applicant.fullAddress} - ${applicant.pincode}</p>
    `,
    attachments
  });

  if (info.message) {
    console.log("Admin email prepared:", info.message);
  }

  return true;
};

export const sendApplicantConfirmationEmail = async (applicant) => {
  const info = await getTransporter().sendMail({
    from: from(),
    to: applicant.email,
    subject: `Application received: ${applicant.applicationId}`,
    html: `
      <h2>Thanks for applying, ${applicant.fullName}.</h2>
      <p>We received your application successfully.</p>
      <p><strong>Application ID:</strong> ${applicant.applicationId}</p>
      <p>Our hiring team will review your profile and contact you if your skills match an open role.</p>
    `
  });

  if (info.message) {
    console.log("Applicant email prepared:", info.message);
  }

  return true;
};
