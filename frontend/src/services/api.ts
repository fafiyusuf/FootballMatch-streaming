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
