import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { showDashboard } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/dashboard", requireAuth, showDashboard);

export default router;
