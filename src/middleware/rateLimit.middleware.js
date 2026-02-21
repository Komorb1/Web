// src/middleware/rateLimit.middleware.js
import rateLimit from "express-rate-limit";

function envInt(name, fallback) {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

export const authLimiter = rateLimit({
  windowMs: envInt("AUTH_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000), // 15 min
  max: envInt("AUTH_RATE_LIMIT_MAX", 10), // 10 attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    // Friendly message, consistent with your error rendering
    return res.status(429).render("pages/login", {
      title: "Login",
      errors: ["Too many attempts. Please wait a bit and try again."],
      form: { email: (req.body?.email || "").trim().toLowerCase() },
    });
  },
});

export const registerLimiter = rateLimit({
  windowMs: envInt("AUTH_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  max: envInt("AUTH_RATE_LIMIT_MAX", 10),
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    return res.status(429).render("pages/register", {
      title: "Register",
      errors: ["Too many attempts. Please wait a bit and try again."],
      form: {
        full_name: (req.body?.full_name || "").trim(),
        email: (req.body?.email || "").trim().toLowerCase(),
      },
    });
  },
});