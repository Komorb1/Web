import { Router } from "express";
import {
  showLogin,
  showRegister,
  loginUser,
  registerUser,
  logoutUser,
} from "../controllers/auth.controller.js";

import { validateBody } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validation/schemas.js";

const router = Router();

router.get("/login", showLogin);
router.post(
  "/login",
  validateBody(loginSchema, {
    view: "pages/login",
    title: "Login",
    pickForm: (b) => ({ email: (b.email || "").trim().toLowerCase() }),
  }),
  loginUser
);

router.get("/register", showRegister);
router.post(
  "/register",
  validateBody(registerSchema, {
    view: "pages/register",
    title: "Register",
    pickForm: (b) => ({
      full_name: (b.full_name || "").trim(),
      email: (b.email || "").trim().toLowerCase(),
    }),
  }),
  registerUser
);

router.post("/logout", logoutUser);

export default router;