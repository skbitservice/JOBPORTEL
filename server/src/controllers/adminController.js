import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import Admin from "../models/Admin.js";
import Applicant from "../models/Applicant.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signToken = (admin) =>
  jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: "8h"
  });

const buildApplicantQuery = (query) => {
  const filter = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.location) {
    const location = new RegExp(query.location, "i");
    filter.$or = [{ city: location }, { state: location }, { "currentLocation.label": location }];
  }

  if (query.skill) {
    filter.skills = new RegExp(query.skill, "i");
  }

  const experience = {};
  if (query.experienceMin !== undefined && query.experienceMin !== "") {
    experience.$gte = Number(query.experienceMin);
  }
  if (query.experienceMax !== undefined && query.experienceMax !== "") {
    experience.$lte = Number(query.experienceMax);
  }
  if (Object.keys(experience).length > 0) {
    filter.experience = experience;
  }

  return filter;
};

const publicApplicant = (applicant) => ({
  id: applicant._id,
  applicationId: applicant.applicationId,
  fullName: applicant.fullName,
  mobile: applicant.mobile,
  email: applicant.email,
  fullAddress: applicant.fullAddress,
  city: applicant.city,
  state: applicant.state,
  pincode: applicant.pincode,
  currentLocation: applicant.currentLocation,
  skills: applicant.skills,
  experience: applicant.experience,
  status: applicant.status,
  hasResume: Boolean(applicant.files?.resume),
  hasPhoto: Boolean(applicant.files?.photo),
  createdAt: applicant.createdAt
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").toLowerCase().trim();
  const password = String(req.body.password || "");

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  res.json({
    token: signToken(admin),
    admin: {
      name: admin.name,
      email: admin.email
    }
  });
});

export const getAdminProfile = asyncHandler(async (req, res) => {
  res.json({ admin: req.admin });
});

export const listApplicants = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 12), 1), 100);
  const skip = (page - 1) * limit;
  const filter = buildApplicantQuery(req.query);

  const [items, total, stats] = await Promise.all([
    Applicant.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Applicant.countDocuments(filter),
    Applicant.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgExperience: { $avg: "$experience" },
          shortlisted: {
            $sum: { $cond: [{ $eq: ["$status", "Shortlisted"] }, 1, 0] }
          }
        }
      }
    ])
  ]);

  res.json({
    items: items.map(publicApplicant),
    total,
    page,
    pages: Math.ceil(total / limit),
    stats: stats[0] || { total: 0, avgExperience: 0, shortlisted: 0 }
  });
});

export const getApplicant = asyncHandler(async (req, res) => {
  const applicant = await Applicant.findById(req.params.id);
  if (!applicant) {
    return res.status(404).json({ message: "Applicant not found." });
  }

  res.json({ applicant: publicApplicant(applicant) });
});

export const updateApplicantStatus = asyncHandler(async (req, res) => {
  const status = String(req.body.status || "");
  if (!["New", "Reviewed", "Shortlisted", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid applicant status." });
  }

  const applicant = await Applicant.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!applicant) {
    return res.status(404).json({ message: "Applicant not found." });
  }

  res.json({ applicant: publicApplicant(applicant) });
});

export const exportApplicantsExcel = asyncHandler(async (req, res) => {
  const applicants = await Applicant.find(buildApplicantQuery(req.query)).sort({ createdAt: -1 });
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Applicants");

  sheet.columns = [
    { header: "Application ID", key: "applicationId", width: 18 },
    { header: "Name", key: "fullName", width: 26 },
    { header: "Mobile", key: "mobile", width: 18 },
    { header: "Email", key: "email", width: 28 },
    { header: "City", key: "city", width: 18 },
    { header: "State", key: "state", width: 18 },
    { header: "Pincode", key: "pincode", width: 12 },
    { header: "Current Location", key: "currentLocation", width: 32 },
    { header: "Skills", key: "skills", width: 36 },
    { header: "Experience", key: "experience", width: 12 },
    { header: "Status", key: "status", width: 14 },
    { header: "Applied At", key: "createdAt", width: 24 }
  ];

  applicants.forEach((applicant) => {
    sheet.addRow({
      applicationId: applicant.applicationId,
      fullName: applicant.fullName,
      mobile: applicant.mobile,
      email: applicant.email,
      city: applicant.city,
      state: applicant.state,
      pincode: applicant.pincode,
      currentLocation: applicant.currentLocation?.label || "",
      skills: applicant.skills.join(", "),
      experience: applicant.experience,
      status: applicant.status,
      createdAt: applicant.createdAt.toISOString()
    });
  });

  sheet.getRow(1).font = { bold: true };

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=applicants.xlsx");
  await workbook.xlsx.write(res);
  res.end();
});

export const exportApplicantsPdf = asyncHandler(async (req, res) => {
  const applicants = await Applicant.find(buildApplicantQuery(req.query)).sort({ createdAt: -1 }).limit(500);
  const doc = new PDFDocument({ margin: 42, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=applicants.pdf");
  doc.pipe(res);

  doc.fontSize(20).text("HireWave Applicants", { continued: false });
  doc.fontSize(10).fillColor("#667085").text(`Generated ${new Date().toLocaleString()}`);
  doc.moveDown();

  applicants.forEach((applicant, index) => {
    doc
      .fillColor("#111827")
      .fontSize(12)
      .text(`${index + 1}. ${applicant.fullName} - ${applicant.applicationId}`, { underline: true });
    doc
      .fontSize(9)
      .fillColor("#374151")
      .text(`${applicant.email} | ${applicant.mobile} | ${applicant.city}, ${applicant.state}`);
    doc.text(`Experience: ${applicant.experience} years | Skills: ${applicant.skills.join(", ")}`);
    doc.text(`Status: ${applicant.status} | Applied: ${applicant.createdAt.toLocaleDateString()}`);
    doc.moveDown(0.8);
  });

  doc.end();
});
