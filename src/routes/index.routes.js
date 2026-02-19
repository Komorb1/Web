import { Router } from "express";
import { homePage } from "../controllers/index.controller.js";
import { get } from "../config/db.js";

const router = Router();

router.get("/", homePage);
router.get("/db-test", (req, res) => {
  const result = get("SELECT 1 as test");
  res.json(result);
});
export default router;
