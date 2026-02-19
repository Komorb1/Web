import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { initDb } from "./config/initDb.js";
import authRoutes from "./routes/auth.routes.js";
import session from "express-session";
import dashboardRoutes from "./routes/dashboard.routes.js";
import flightRoutes from "./routes/flight.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

import indexRoutes from "./routes/index.routes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
initDb();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
  })
);
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});


// Static
app.use(express.static(path.join(__dirname, "..", "public")));

// Routes
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", flightRoutes);
app.use("/", bookingRoutes);

// 404
app.use((req, res) => {
  res.status(404).render("pages/404", { title: "Not Found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
