function storeReturnTo(req) {
  const isGetRequest = req.method === "GET";
  const isLoginPage = req.originalUrl.startsWith("/login");
  const isLogoutPage = req.originalUrl.startsWith("/logout");

  if (isGetRequest && !isLoginPage && !isLogoutPage) {
    req.session.returnTo = req.originalUrl;
  }
}

export function requireAuth(req, res, next) {
  if (!req.session.user) {
    storeReturnTo(req);
    return res.redirect("/login");
  }

  next();
}