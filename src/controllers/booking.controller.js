import { bookFlight } from "../models/booking.model.js";

export function createBooking(req, res) {
  const flight_id = Number(req.params.id);
  const user_id = req.session.user.id;

  if (!Number.isInteger(flight_id)) {
    return res.status(400).send("Invalid flight id.");
  }

  const result = bookFlight({ user_id, flight_id });

  if (!result.ok) {
    if (result.reason === "not_found") {
      return res.status(404).send("Flight not found.");
    }
    if (result.reason === "sold_out") {
      return res.status(409).send("Sorry, this flight is sold out.");
    }
    return res.status(500).send("Booking failed.");
  }

  if (result.reason === "too_late") {
    return res.status(409).send("You can't book a flight that has already departed.");
  }

  return res.redirect("/bookings");
}
