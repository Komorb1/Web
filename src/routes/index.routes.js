import { Router } from "express";
import { homePage } from "../controllers/index.controller.js";

const router = Router();

router.get("/", homePage);

export default router;
