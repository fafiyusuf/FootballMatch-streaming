import { Router } from "express";
import { getMatches, subscribeToMatch, updateMatch } from "../controllers/matchController.js";

const router = Router();

router.get("/", getMatches);
router.get("/events/:id", subscribeToMatch);
router.post("/update/:id", updateMatch);

export default router;
