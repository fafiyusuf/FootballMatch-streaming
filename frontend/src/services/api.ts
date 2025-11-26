import { Match } from "../types/Match";

const BASE_URL = "http://localhost:5000";

export async function fetchMatches(): Promise<Match[]> {
  const res = await fetch(`${BASE_URL}/matches`);
  return res.json();
}

export function openSSE(matchId: number, onMessage: (data: Match) => void) {
  const events = new EventSource(`${BASE_URL}/matches/events/${matchId}`);

  events.onmessage = (event) => {
    const parsed: Match = JSON.parse(event.data);
    onMessage(parsed);
  };

  return events;
}

export function openAllMatchesSSE(onInit: (matches: Match[]) => void, onUpdate: (updated: Match) => void) {
  const events = new EventSource(`${BASE_URL}/matches/events`);
  events.onmessage = (event) => {
    const parsed = JSON.parse(event.data);
    if (parsed.type === 'init' && Array.isArray(parsed.matches)) {
      onInit(parsed.matches as Match[]);
    } else if (parsed.id) {
      onUpdate(parsed as Match);
    }
  };
  return events;
}

export async function updateMatch(id: number, homeGoals: number, awayGoals: number, scorer: string | null) {
  const res = await fetch(`${BASE_URL}/matches/update/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ homeGoals, awayGoals, scorer })
  });
  if (!res.ok) throw new Error("Failed to update match");
  return res.json();
}

export async function createMatch(home: string, away: string) {
  const res = await fetch(`${BASE_URL}/matches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ home, away }),
  });
  if (!res.ok) throw new Error("Failed to create match");
  return res.json();
}

export async function deleteMatch(id: number) {
  const res = await fetch(`${BASE_URL}/matches/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete match");
  return res.json();
}
