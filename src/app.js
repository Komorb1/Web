import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import csrf from "csurf";
import helmet from "helmet";
import morgan from "morgan";

import { initDb } from "./config/initDb.js";
import { sessionMiddleware } from "./config/session.js";
import { flashMiddleware } from "./middleware/flash.middleware.js";

import indexRoutes from "./routes/index.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import flightRoutes from "./routes/flight.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import myBookingsRoutes from "./routes/mybookings.routes.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

initDb();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'none'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:"],
        "font-src": ["'self'"],
        "connect-src": ["'self'"],
        "object-src": ["'none'"],
        "worker-src": ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Request logging
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session + flash
app.use(sessionMiddleware);
app.use(flashMiddleware);

// CSRF
const csrfProtection = csrf();
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Logged-in user for views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Static files
app.use(express.static(path.join(__dirname, "..", "public")));

// Routes
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", flightRoutes);
app.use("/", bookingRoutes);
app.use("/", myBookingsRoutes);

// 404
app.use((req, res) => {
  return res.status(404).render("pages/404", { title: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";

  if (err && err.code === "EBADCSRFTOKEN") {
    console.warn("CSRF error", {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
    });

    return res.status(403).render("pages/403", {
      title: "Forbidden",
      message: "Invalid or expired form token. Please try again.",
    });
  }

  console.error("Unhandled error", {
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    message: err?.message,
    stack: isProd ? undefined : err?.stack,
  });

  return res.status(500).render("pages/500", {
    title: "Server Error",
    message: isProd
      ? "Something went wrong. Please try again."
      : err?.message || "Something went wrong.",
    details: isProd ? null : err?.stack || null,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});