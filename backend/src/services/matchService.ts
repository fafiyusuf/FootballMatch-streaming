import type { Response } from "express";

interface ClientMap {
  [matchId: number]: Response[];
}

export const clients: ClientMap = {};

/** Register client for SSE */
export function registerClient(matchId: number, res: Response) {
  if (!clients[matchId]) clients[matchId] = [];
  clients[matchId].push(res);
}

/** Broadcast update to all clients watching that match */
export function broadcast(matchId: number, data: any) {
  if (!clients[matchId]) return;

  clients[matchId].forEach((res) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

/** Remove closed connections */
export function removeClient(matchId: number, res: Response) {
  if (clients[matchId]) {
    clients[matchId] = clients[matchId].filter((client) => client !== res);
  }
}
