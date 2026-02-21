import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { showMyBookings } from "../controllers/mybookings.controller.js";
import { cancelMyBooking } from "../controllers/cancelbooking.controller.js";

import { validateParams } from "../middleware/validate.middleware.js";
import { idParamSchema } from "../validation/schemas.js";

const router = Router();

router.get("/bookings", requireAuth, showMyBookings);

router.post(
  "/bookings/:id/cancel",
  requireAuth,
  validateParams(idParamSchema),
  cancelMyBooking
);

export default router;