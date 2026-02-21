import { createFlight, listFlights } from "../models/flight.model.js";

export function showFlights(req, res) {
  const { origin = "", destination = "", date = "" } = req.query;

  const flights = listFlights({
    origin,
    destination,
    date,
    futureOnly: true, // optional requirement: enable it
  });

  res.render("pages/flights", {
    title: "Flights",
    flights,
    filters: { origin, destination, date },
  });
}


export function showNewFlightForm(req, res) {
  res.render("pages/admin/new-flight", {
    title: "Create Flight",
    errors: [],
    form: {
      origin: "",
      destination: "",
      departure_time: "",
      arrival_time: "",
      price: "",
      total_seats: "",
    },
  });
}

export function createNewFlight(req, res) {
  const { origin, destination, departure_time, arrival_time, price, total_seats } =
    req.validated?.body || req.body;

  try {
    createFlight({
      origin,
      destination,
      departure_time,
      arrival_time,
      price,
      total_seats,
    });

    req.flash("success", "Flight created successfully.");
    return res.redirect("/flights");
  } catch (err) {
    req.flash("error", "Could not create flight. Please try again.");
    return res.redirect("/admin/flights/new");
  }
}
