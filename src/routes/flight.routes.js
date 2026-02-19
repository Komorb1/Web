import { Router } from "express";
import { showFlights, showNewFlightForm, createNewFlight } from "../controllers/flight.controller.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

// Public list + search
router.get("/flights", showFlights);

// Admin create
router.get("/admin/flights/new", requireAdmin, showNewFlightForm);
router.post("/admin/flights", requireAdmin, createNewFlight);

export default router;

