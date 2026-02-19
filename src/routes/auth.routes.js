import { Router } from "express";
import { showRegister, registerUser, showLogin, loginUser, logoutUser } from "../controllers/auth.controller.js";

const router = Router();

router.get("/register", showRegister);
router.post("/register", registerUser);

router.get("/login", showLogin);
router.post("/login", loginUser);

router.post("/logout", logoutUser);

export default router;
