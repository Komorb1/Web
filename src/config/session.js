// src/config/session.js
import session from "express-session";

const isProd = process.env.NODE_ENV === "production";

if (isProd && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required in production.");
}

export const sessionMiddleware = session({
  name: process.env.SESSION_COOKIE_NAME || "sid",
  secret: process.env.SESSION_SECRET || "dev-only-secret-change-me",
  resave: false,
  saveUninitialized: false,
  rolling: true, // refresh expiration on activity (optional, but nice)
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd, // true in prod (HTTPS), false in dev (HTTP)
    maxAge: Number(process.env.SESSION_MAX_AGE_MS || 1000 * 60 * 60 * 24 * 7), // 7 days
  },
});