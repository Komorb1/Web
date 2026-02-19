import { listBookingsByUser } from "../models/booking.model.js";

export function showMyBookings(req, res) {
  const user_id = req.session.user.id;

  const bookings = listBookingsByUser(user_id);

  res.render("pages/bookings", {
    title: "My Bookings",
    bookings,
  });
}
