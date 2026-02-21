import { Router } from "express";
import { showFlights, showNewFlightForm, createNewFlight } from "../controllers/flight.controller.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

import { validateBody } from "../middleware/validate.middleware.js";
import { createFlightSchema } from "../validation/schemas.js";

const router = Router();

// Public list + search
router.get("/flights", showFlights);

// Admin create
router.get("/admin/flights/new", requireAdmin, showNewFlightForm);

router.post(
  "/admin/flights",
  requireAdmin,
  validateBody(createFlightSchema, {
    view: "pages/admin/new-flight",
    title: "Create Flight (Admin)",
    pickForm: (b) => ({
      origin: (b.origin || "").trim(),
      destination: (b.destination || "").trim(),
      departure_time: b.departure_time || "",
      arrival_time: b.arrival_time || "",
      price: b.price || "",
      total_seats: b.total_seats || "",
    }),
  }),
  createNewFlight
);

export default router;