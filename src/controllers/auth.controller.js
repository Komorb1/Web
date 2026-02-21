import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "../models/user.model.js";

export function showRegister(req, res) {
  res.render("pages/register", { title: "Register", errors: [], form: { full_name: "", email: "" } });
}

export function showLogin(req, res) {
  res.render("pages/login", { title: "Login", errors: [], form: { email: "" } });
}

export function loginUser(req, res) {
  const { email, password } = req.validated?.body || req.body;

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).render("pages/login", {
      title: "Login",
      errors: ["Invalid email or password."],
      form: { email },
    });
  }

  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) {
    return res.status(401).render("pages/login", {
      title: "Login",
      errors: ["Invalid email or password."],
      form: { email },
    });
  }

  // Regenerate session on login (session fixation protection)
  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).render("pages/login", {
        title: "Login",
        errors: ["Something went wrong. Please try again."],
        form: { email },
      });
    }

    req.session.user = {
      id: user.id,
      full_name: user.full_name,
      role: user.role,
    };

    req.session.save((err2) => {
      if (err2) {
        return res.status(500).render("pages/login", {
          title: "Login",
          errors: ["Something went wrong. Please try again."],
          form: { email },
        });
      }

      return res.redirect("/dashboard");
    });
  });
}

export function logoutUser(req, res) {
  const cookieName = process.env.SESSION_COOKIE_NAME || "sid";

  req.session.destroy((err) => {
    // Even if destroy errors, clearing the cookie helps the browser forget it
    res.clearCookie(cookieName);

    if (err) {
      return res.status(500).render("pages/login", {
        title: "Login",
        errors: ["Could not log out. Please try again."],
        form: { email: "" },
      });
    }

    return res.redirect("/login");
  });
}

export function registerUser(req, res) {
  const { full_name, email, password } = req.validated?.body || req.body;

  const existing = findUserByEmail(email);
  if (existing) {
    return res.status(409).render("pages/register", {
      title: "Register",
      errors: ["Email is already registered."],
      form: { full_name, email },
    });
  }

  const password_hash = bcrypt.hashSync(password, 10);

  try {
    createUser({ full_name, email, password_hash });
    return res.redirect("/login");
  } catch (err) {
    return res.status(500).render("pages/register", {
      title: "Register",
      errors: ["Something went wrong. Please try again."],
      form: { full_name, email },
    });
  }
}