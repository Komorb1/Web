import { get, run } from "../config/db.js";

export function findUserByEmail(email) {
  return get("SELECT id, full_name, email, password_hash, role FROM users WHERE email = ?", [email]);
}

export function createUser({ full_name, email, password_hash, role = "user" }) {
  return run(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES (?, ?, ?, ?)`,
    [full_name, email, password_hash, role]
  );
}
