import { cancelBooking } from "../models/booking.model.js";

export function cancelMyBooking(req, res) {
  const booking_id = req.validated?.params?.id ?? Number(req.params.id);
  const user_id = req.session.user.id;

  const result = cancelBooking({ booking_id, user_id });

  if (!result.ok) {
    if (result.reason === "not_found") {
      return res.status(404).render("pages/404", { title: "Not Found" });
    }

    if (result.reason === "forbidden") {
      return res.status(403).render("pages/403", {
        title: "Forbidden",
        message: "You are not allowed to cancel this booking.",
      });
    }

    if (result.reason === "already_cancelled") {
      return res.status(409).render("pages/400", {
        title: "Booking Conflict",
        message: "This booking is already cancelled (or not confirmed).",
      });
    }

    if (result.reason === "too_late") {
      return res.status(409).render("pages/400", {
        title: "Booking Conflict",
        message: "Too late to cancel this booking.",
      });
    }

    return res.status(500).render("pages/400", {
      title: "Error",
      message: "Cancellation failed. Please try again.",
    });
  }

  return res.redirect("/bookings");
}