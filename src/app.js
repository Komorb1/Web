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
import myBookingsRoutes from "./routes/mybookings.routes.js";
import { sessionMiddleware } from "./config/session.js";
import csrf from "csurf";
import helmet from "helmet";
import { flashMiddleware } from "./middleware/flash.middleware.js";

import indexRoutes from "./routes/index.routes.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

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
app.use(sessionMiddleware);
app.use(flashMiddleware);

const csrfProtection = csrf();
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

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
app.use("/", myBookingsRoutes);

// - Detect CSRF error
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).render("pages/403", {
      title: "Forbidden",
      message: "Invalid or expired form token. Please try again.",
    });
  }
  next(err);
});

// 404
app.use((req, res) => {
  res.status(404).render("pages/404", { title: "Not Found" });
});

// Security headers with Helmet
app.use(
  helmet({
    // Keep CSP on, but set it explicitly so you control breakage risk
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        // defaults + your additions
        "default-src": ["'self'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'none'"],

        // If your CSS/JS is served locally, this is enough
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],

        // allow images from your site + data: (for icons/inline images if you ever use them)
        "img-src": ["'self'", "data:"],

        // fonts usually come from self; if using Google Fonts later you must add it here
        "font-src": ["'self'"],

        // If you don’t use XHR to other origins, keep it strict
        "connect-src": ["'self'"],

        // If you don’t embed objects, block them
        "object-src": ["'none'"],

        // If you don’t use workers, keep locked down
        "worker-src": ["'self'"],
      },
    },

    // This is fine for most apps; can be adjusted later if you embed cross-origin resources
    crossOriginEmbedderPolicy: false,
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
