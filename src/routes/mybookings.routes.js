import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { showMyBookings } from "../controllers/mybookings.controller.js";

const router = Router();

router.get("/bookings", requireAuth, showMyBookings);

export default router;
