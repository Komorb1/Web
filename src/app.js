import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import indexRoutes from "./routes/index.routes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static
app.use(express.static(path.join(__dirname, "..", "public")));

// Routes
app.use("/", indexRoutes);

// 404
app.use((req, res) => {
  res.status(404).render("pages/404", { title: "Not Found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
