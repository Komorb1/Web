import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { showMyBookings } from "../controllers/mybookings.controller.js";
import { cancelMyBooking } from "../controllers/cancelbooking.controller.js";

const router = Router();

router.get("/bookings", requireAuth, showMyBookings);
router.post("/bookings/:id/cancel", requireAuth, cancelMyBooking);

export default router;
