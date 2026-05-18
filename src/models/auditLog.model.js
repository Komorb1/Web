import { run } from "../config/db.js";

export function createAuditLog({ user_id, action, metadata = {} }) {
  return run(
    `INSERT INTO audit_logs (user_id, action, metadata)
     VALUES (?, ?, ?)`,
    [user_id || null, action, JSON.stringify(metadata)]
  );
}