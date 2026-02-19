import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function initDb() {
  const schemaPath = path.join(__dirname, "../../db/schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf-8");

  db.exec(schemaSql);
  console.log("Database schema ensured (tables ready).");
}
