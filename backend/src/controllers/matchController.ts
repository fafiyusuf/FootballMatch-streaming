import type { Request, Response } from "express";
import { matches } from "../data/matches.js";
import { broadcast, registerClient, registerGlobalClient, removeClient, removeGlobalClient } from "../services/matchService.js";

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

  // Ensure headers are flushed for some proxies
  if (typeof (res as any).flushHeaders === 'function') {
    (res as any).flushHeaders();
  }

  // Register client
  registerClient(matchId, res);

  // Send initial state of the match immediately so clients have current score
  const match = matches.find(m => m.id === matchId);
  if (match) {
    res.write(`data: ${JSON.stringify(match)}\n\n`);
  } else {
    res.write(`data: ${JSON.stringify({ error: "Match not found" })}\n\n`);
  }

  // Heartbeat to keep connection alive (every 30s)
  const heartbeat = setInterval(() => {
    res.write(`: heartbeat\n\n`); // comment line per SSE spec
  }, 30000);

  req.on("close", () => {
    clearInterval(heartbeat);
    removeClient(matchId, res);
  });
}

/** SSE connection for all match updates (used by list page) */
export function subscribeToAllMatches(req: Request, res: Response) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  if (typeof (res as any).flushHeaders === 'function') {
    (res as any).flushHeaders();
  }

  // Register global client
  registerGlobalClient(res);

  // Send initial full matches array
  res.write(`data: ${JSON.stringify({ type: 'init', matches })}\n\n`);

  // Heartbeat
  const heartbeat = setInterval(() => {
    res.write(`: heartbeat\n\n`);
  }, 30000);

  req.on('close', () => {
    clearInterval(heartbeat);
    removeGlobalClient(res);
  });
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
