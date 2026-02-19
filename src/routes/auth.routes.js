import { Router } from "express";
import { showRegister, registerUser, showLogin } from "../controllers/auth.controller.js";

const router = Router();

// Register
router.get("/register", showRegister);
router.post("/register", registerUser);

// Login (placeholder for now so redirect works)
router.get("/login", showLogin);

export default router;
