import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { createBooking } from "../controllers/booking.controller.js";

const router = Router();

router.post("/flights/:id/book", requireAuth, createBooking);

export default router;
