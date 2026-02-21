import { ZodError } from "zod";

function zodIssuesToMessages(err) {
  if (!(err instanceof ZodError)) return ["Invalid request."];
  return err.issues.map((i) => i.message);
}

export function validateBody(schema, { view, title, pickForm } = {}) {
  return (req, res, next) => {
    try {
      req.validated = req.validated || {};
      req.validated.body = schema.parse(req.body);
      return next();
    } catch (err) {
      const errors = zodIssuesToMessages(err);

      if (view) {
        const form = pickForm ? pickForm(req.body) : {};
        return res.status(400).render(view, { title, errors, form });
      }

      return res.status(400).render("pages/400", {
        title: "Bad Request",
        message: errors[0] || "Invalid request.",
      });
    }
  };
}

export function validateParams(schema) {
  return (req, res, next) => {
    try {
      req.validated = req.validated || {};
      req.validated.params = schema.parse(req.params);
      return next();
    } catch (err) {
      const errors = zodIssuesToMessages(err);
      return res.status(400).render("pages/400", {
        title: "Bad Request",
        message: errors[0] || "Invalid request.",
      });
    }
  };
}