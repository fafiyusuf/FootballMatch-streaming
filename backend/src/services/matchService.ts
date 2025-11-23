import type { Response } from "express";

interface ClientMap {
  [matchId: number]: Response[];
}

export const clients: ClientMap = {};
// Global subscribers (e.g. match list page) receive all match updates
export const globalClients: Response[] = [];

/** Register client for SSE */
export function registerClient(matchId: number, res: Response) {
  if (!clients[matchId]) clients[matchId] = [];
  clients[matchId].push(res);
}

export function registerGlobalClient(res: Response) {
  globalClients.push(res);
}

/** Broadcast update to all clients watching that match */
export function broadcast(matchId: number, data: any) {
  if (clients[matchId]) {
    clients[matchId].forEach((res) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }
  // Also send to global subscribers
  globalClients.forEach((res) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

/** Remove closed connections */
export function removeClient(matchId: number, res: Response) {
  if (clients[matchId]) {
    clients[matchId] = clients[matchId].filter((client) => client !== res);
  }
}

export function removeGlobalClient(res: Response) {
  const idx = globalClients.indexOf(res);
  if (idx !== -1) globalClients.splice(idx, 1);
}
