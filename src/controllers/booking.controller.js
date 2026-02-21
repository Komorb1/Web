import { bookFlight } from "../models/booking.model.js";

export function createBooking(req, res) {
  const flight_id = req.validated?.params?.id ?? Number(req.params.id);
  const user_id = req.session.user.id;

  const result = bookFlight({ user_id, flight_id });

  if (!result.ok) {
    if (result.reason === "not_found") req.flash("error", "Flight not found.");
    else if (result.reason === "sold_out") req.flash("error", "Sorry, this flight is sold out.");
    else if (result.reason === "too_late") req.flash("error", "You can't book a flight that has already departed.");
    else req.flash("error", "Booking failed. Please try again.");

    return res.redirect("/flights");
  }

  req.flash("success", "Booking confirmed ✅");
  return res.redirect("/bookings");
}
