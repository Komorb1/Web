export function showDashboard(req, res) {
  res.render("pages/dashboard", { title: "Dashboard", user: req.session.user });
}
