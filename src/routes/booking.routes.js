import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { createBooking } from "../controllers/booking.controller.js";

import { validateParams } from "../middleware/validate.middleware.js";
import { idParamSchema } from "../validation/schemas.js";

const router = Router();

router.post(
  "/flights/:id/book",
  requireAuth,
  validateParams(idParamSchema),
  createBooking
);

export default router;