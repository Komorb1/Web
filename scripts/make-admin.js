import { findUserByEmail, makeUserAdminByEmail } from "../src/models/user.model.js";

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error("Usage: node scripts/make-admin.js user@example.com");
  process.exit(1);
}

const user = findUserByEmail(email);

if (!user) {
  console.error(`No user found with email: ${email}`);
  process.exit(1);
}

if (user.role === "admin") {
  console.log(`${email} is already an admin.`);
  process.exit(0);
}

const result = makeUserAdminByEmail(email);

if (result.changes === 1) {
  console.log(`Success: ${email} is now an admin.`);
  process.exit(0);
}

console.error(`Failed to promote user: ${email}`);
process.exit(1);