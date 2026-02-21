import { cancelBooking } from "../models/booking.model.js";

export function cancelMyBooking(req, res) {
  const booking_id = req.validated?.params?.id ?? Number(req.params.id);
  const user_id = req.session.user.id;

  const result = cancelBooking({ booking_id, user_id });

  if (!result.ok) {
    if (result.reason === "not_found") {
      req.flash("error", "Booking not found.");
    } else if (result.reason === "forbidden") {
      req.flash("error", "You are not allowed to cancel this booking.");
    } else if (result.reason === "already_cancelled" || result.reason === "not_confirmed") {
      req.flash("info", "This booking is already cancelled (or not confirmed).");
    } else if (result.reason === "too_late") {
      req.flash("error", "Too late to cancel this booking.");
    } else {
      req.flash("error", "Cancellation failed. Please try again.");
    }

    return res.redirect("/bookings");
  }

  req.flash("success", "Booking cancelled.");
  return res.redirect("/bookings");
}