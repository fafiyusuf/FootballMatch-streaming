import type { Request, Response } from "express";
import { matches } from "../data/matches.js";
import { broadcast, registerClient, removeClient } from "../services/matchService.js";

/** Get all matches */
export function getMatches(req: Request, res: Response) {
  res.json(matches);
}

/** SSE connection for live updates */
export function subscribeToMatch(req: Request, res: Response) {
  const matchId = Number(req.params.id);

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Register client
  registerClient(matchId, res);

  // Initial message
  res.write(`data: ${JSON.stringify({ message: "connected" })}\n\n`);

  req.on("close", () => removeClient(matchId, res));
}

/** Admin updates match score */
export function updateMatch(req: Request, res: Response) {
  const matchId = Number(req.params.id);
  const { homeGoals, awayGoals, scorer } = req.body;

  const match = matches.find((m) => m.id === matchId);
  if (!match) return res.status(404).json({ message: "Match not found" });

  match.score = `${homeGoals}-${awayGoals}`;
  match.scorer = scorer;

  // Broadcast update
  broadcast(matchId, match);

  res.json({ message: "Match updated", match });
}
