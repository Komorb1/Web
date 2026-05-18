import { listBookingsByUser } from "../models/booking.model.js";
import { formatDateTime, displayTimezone } from "../utils/time.js";

export function showMyBookings(req, res) {
  const user_id = req.session.user.id;

  const bookings = listBookingsByUser(user_id);

  const formattedBookings = bookings.map((booking) => ({
    ...booking,
    departure_time_display: formatDateTime(booking.departure_time),
    arrival_time_display: formatDateTime(booking.arrival_time),
    booking_created_at_display: formatDateTime(booking.booking_created_at),
  }));

  res.render("pages/bookings", {
    title: "My Bookings",
    bookings: formattedBookings,
    displayTimezone,
  });
}