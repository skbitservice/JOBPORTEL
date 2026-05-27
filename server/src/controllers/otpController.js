import bcrypt from "bcryptjs";
import Otp from "../models/Otp.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOtpSms } from "../utils/sms.js";

const mobileRegex = /^\+?[0-9]{10,15}$/;

export const sendOtp = asyncHandler(async (req, res) => {
  const mobile = String(req.body.mobile || "").replace(/\s|-/g, "");

  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({ message: "Enter a valid mobile number." });
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = await bcrypt.hash(otp, 12);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await Otp.findOneAndUpdate(
    { mobile },
    { mobile, codeHash, expiresAt, verified: false, attempts: 0 },
    { upsert: true, new: true }
  );

  const sms = await sendOtpSms({ mobile, otp });

  res.json({
    message: "OTP sent successfully.",
    provider: sms.provider,
    devOtp: process.env.NODE_ENV === "production" ? undefined : otp
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const mobile = String(req.body.mobile || "").replace(/\s|-/g, "");
  const otp = String(req.body.otp || "");

  if (!mobileRegex.test(mobile) || !/^[0-9]{6}$/.test(otp)) {
    return res.status(400).json({ message: "Enter a valid mobile number and 6-digit OTP." });
  }

  const record = await Otp.findOne({ mobile });
  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP expired. Please request a new code." });
  }

  if (record.attempts >= 5) {
    return res.status(429).json({ message: "Too many OTP attempts. Please request a new code." });
  }

  const isMatch = await bcrypt.compare(otp, record.codeHash);
  record.attempts += 1;
  record.verified = isMatch;
  await record.save();

  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect OTP." });
  }

  res.json({ message: "Mobile number verified.", verified: true });
});
