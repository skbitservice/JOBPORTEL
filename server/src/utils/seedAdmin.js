import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

export const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "HireWave Admin";

  if (!email || !password) {
    console.warn("ADMIN_EMAIL or ADMIN_PASSWORD is missing. Admin login was not seeded.");
    return;
  }

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ name, email: email.toLowerCase(), passwordHash });
  console.log(`Admin account seeded for ${email}`);
};
