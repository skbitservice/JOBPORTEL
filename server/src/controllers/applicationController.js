import fs from "fs";
import Applicant from "../models/Applicant.js";
import Otp from "../models/Otp.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createApplicationId } from "../utils/applicationId.js";
import { sendAdminApplicantEmail, sendApplicantConfirmationEmail } from "../utils/email.js";
import { cleanupUploadedFiles } from "../middleware/errorHandler.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^\+?[0-9]{10,15}$/;

const normalizeMobile = (value) => String(value || "").replace(/\s|-/g, "");

const filePayload = (file) =>
  file
    ? {
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        mimeType: file.mimetype,
        size: file.size
      }
    : undefined;

const parseLocation = (value) => {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    return {
      label: String(parsed.label || ""),
      lat: parsed.lat === null || parsed.lat === undefined ? undefined : Number(parsed.lat),
      lng: parsed.lng === null || parsed.lng === undefined ? undefined : Number(parsed.lng)
    };
  } catch (_error) {
    return { label: String(value) };
  }
};

const validateBody = (body, files) => {
  const requiredFields = [
    "fullName",
    "mobile",
    "email",
    "fullAddress",
    "city",
    "state",
    "pincode",
    "skills",
    "experience"
  ];

  const missing = requiredFields.filter((field) => !String(body[field] || "").trim());
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(", ")}.`;
  }

  const mobile = normalizeMobile(body.mobile);
  if (!mobileRegex.test(mobile)) {
    return "Enter a valid mobile number with 10 to 15 digits.";
  }

  if (!emailRegex.test(String(body.email || "").toLowerCase())) {
    return "Enter a valid email address.";
  }

  const experience = Number(body.experience);
  if (Number.isNaN(experience) || experience < 0 || experience > 60) {
    return "Experience must be a number between 0 and 60.";
  }

  if (!files?.resume?.[0]) {
    return "Resume upload is required.";
  }

  return null;
};

export const createApplication = asyncHandler(async (req, res) => {
  const validationError = validateBody(req.body, req.files);
  if (validationError) {
    cleanupUploadedFiles(req.files);
    return res.status(400).json({ message: validationError });
  }

  const mobile = normalizeMobile(req.body.mobile);
  const otpRecord = await Otp.findOne({ mobile, verified: true, expiresAt: { $gt: new Date() } });

  if (!otpRecord) {
    cleanupUploadedFiles(req.files);
    return res.status(400).json({ message: "Please verify your mobile number with OTP before submitting." });
  }

  const resume = req.files.resume?.[0];
  const photo = req.files.photo?.[0];
  const applicationId = createApplicationId();
  const skills = String(req.body.skills)
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const applicant = await Applicant.create({
    applicationId,
    fullName: String(req.body.fullName).trim(),
    mobile,
    email: String(req.body.email).toLowerCase().trim(),
    fullAddress: String(req.body.fullAddress).trim(),
    city: String(req.body.city).trim(),
    state: String(req.body.state).trim(),
    pincode: String(req.body.pincode).trim(),
    currentLocation: parseLocation(req.body.currentLocation),
    skills,
    experience: Number(req.body.experience),
    otpVerified: true,
    files: {
      resume: filePayload(resume),
      photo: filePayload(photo)
    }
  });

  otpRecord.verified = false;
  await otpRecord.save();

  let emailDelivered = true;
  try {
    await Promise.all([sendAdminApplicantEmail(applicant), sendApplicantConfirmationEmail(applicant)]);
  } catch (error) {
    emailDelivered = false;
    console.error("Application email failed:", error.message);
  }

  res.status(201).json({
    message: "Application submitted successfully.",
    applicationId: applicant.applicationId,
    emailDelivered
  });
});

export const downloadApplicantFile = asyncHandler(async (req, res) => {
  const applicant = await Applicant.findById(req.params.id);
  if (!applicant) {
    return res.status(404).json({ message: "Applicant not found." });
  }

  const kind = req.params.kind;
  const file = applicant.files?.[kind];
  if (!["resume", "photo"].includes(kind) || !file?.path || !fs.existsSync(file.path)) {
    return res.status(404).json({ message: "File not found." });
  }

  res.download(file.path, file.originalName);
});
