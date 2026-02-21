export function requireAdmin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  if (req.session.user.role !== "admin") return res.status(403).render("pages/403", {
  title: "Forbidden",
  message: "Admin access required.",
});
  next();
}
