import { cancelBooking } from "../models/booking.model.js";

export function cancelMyBooking(req, res) {
  const booking_id = Number(req.params.id);
  const user_id = req.session.user.id;

  if (!Number.isInteger(booking_id)) {
    return res.status(400).send("Invalid booking id.");
  }

  const result = cancelBooking({ booking_id, user_id });

  if (!result.ok) {
    if (result.reason === "not_found") return res.status(404).send("Booking not found.");
    if (result.reason === "forbidden") return res.status(403).send("Forbidden.");
    if (result.reason === "not_confirmed") return res.status(409).send("Booking is not confirmed.");
    if (result.reason === "too_late") return res.status(409).send("Too late to cancel this booking.");
    return res.status(500).send("Cancellation failed.");
  }

  return res.redirect("/bookings");
}
