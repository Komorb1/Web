import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Needed because we use ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = path.join(__dirname, "../../database.sqlite");

// Create or open database file
const db = new Database(dbPath);

console.log("SQLite database connected successfully.");

// Reusable query helpers
export function run(query, params = []) {
  return db.prepare(query).run(params);
}

export function get(query, params = []) {
  return db.prepare(query).get(params);
}

export function all(query, params = []) {
  return db.prepare(query).all(params);
}

export default db;
