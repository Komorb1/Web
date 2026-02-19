import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "../models/user.model.js";

export function showRegister(req, res) {
  res.render("pages/register", { title: "Register", errors: [], form: { full_name: "", email: "" } });
}

export function showLogin(req, res) {
  res.render("pages/login", { title: "Login", errors: [], form: { email: "" } });
}

export function loginUser(req, res) {
  const { email, password } = req.body;

  const errors = [];
  const cleanedEmail = (email || "").trim().toLowerCase();

  if (!cleanedEmail) errors.push("Email is required.");
  if (!password) errors.push("Password is required.");

  if (errors.length > 0) {
    return res.status(400).render("pages/login", {
      title: "Login",
      errors,
      form: { email: cleanedEmail },
    });
  }

  const user = findUserByEmail(cleanedEmail);
  if (!user) {
    return res.status(401).render("pages/login", {
      title: "Login",
      errors: ["Invalid email or password."],
      form: { email: cleanedEmail },
    });
  }

  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) {
    return res.status(401).render("pages/login", {
      title: "Login",
      errors: ["Invalid email or password."],
      form: { email: cleanedEmail },
    });
  }

  // Save minimal info in session
  req.session.user = {
    id: user.id,
    full_name: user.full_name,
    role: user.role,
  };

  return res.redirect("/dashboard");
}

export function registerUser(req, res) {
  const { full_name, email, password } = req.body;

  const errors = [];
  const cleanedName = (full_name || "").trim();
  const cleanedEmail = (email || "").trim().toLowerCase();

  if (!cleanedName) errors.push("Full name is required.");
  if (!cleanedEmail) errors.push("Email is required.");
  if (!password || password.length < 6) errors.push("Password must be at least 6 characters.");

  if (errors.length > 0) {
    return res.status(400).render("pages/register", {
      title: "Register",
      errors,
      form: { full_name: cleanedName, email: cleanedEmail },
    });
  }

  // Check if user exists
  const existing = findUserByEmail(cleanedEmail);
  if (existing) {
    return res.status(409).render("pages/register", {
      title: "Register",
      errors: ["Email is already registered."],
      form: { full_name: cleanedName, email: cleanedEmail },
    });
  }

  const password_hash = bcrypt.hashSync(password, 10);

  try {
    createUser({ full_name: cleanedName, email: cleanedEmail, password_hash });
    return res.redirect("/login");
  } catch (err) {
    // Handles edge cases like unique constraint race
    return res.status(500).render("pages/register", {
      title: "Register",
      errors: ["Something went wrong. Please try again."],
      form: { full_name: cleanedName, email: cleanedEmail },
    });
  }
}
