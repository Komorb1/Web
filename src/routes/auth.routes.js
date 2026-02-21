import { Router } from "express";
import { showRegister, registerUser, showLogin, loginUser, logoutUser } from "../controllers/auth.controller.js";
import { authLimiter, registerLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.get("/register", showRegister);
router.post("/register", registerLimiter, registerUser);

router.get("/login", showLogin);
router.post("/login", authLimiter, loginUser);

router.post("/logout", logoutUser);

export default router;
