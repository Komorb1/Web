export function flashMiddleware(req, res, next) {
  // initialize store
  if (!req.session.flash) req.session.flash = {};

  // setter: req.flash("success" | "error" | "info", "message")
  req.flash = (type, message) => {
    if (!req.session.flash[type]) req.session.flash[type] = [];
    req.session.flash[type].push(String(message));
  };

  // expose and clear (one-time)
  res.locals.flash = req.session.flash;
  req.session.flash = {};

  next();
}