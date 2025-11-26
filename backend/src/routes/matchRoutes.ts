import { Router } from "express";
import { createMatch, deleteMatch, getMatches, subscribeToAllMatches, subscribeToMatch, updateMatch } from "../controllers/matchController.js";

const router = Router();

router.get("/", getMatches);
router.get("/events", subscribeToAllMatches); // global updates
router.get("/events/:id", subscribeToMatch);
router.post("/update/:id", updateMatch);
router.post("/", createMatch);
router.delete("/:id", deleteMatch);

export default router;
