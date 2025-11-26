import type { Match } from "../types/Match.js";
import { getMatchesStore, loadMatches } from "./matchStore.js";

// Seed data used the first time or if matches.json is invalid
const seedMatches: Match[] = [
  { id: 1, home: "Arsenal", away: "Chelsea", score: "0-0", scorer: null },
  { id: 2, home: "Liverpool", away: "Everton", score: "0-0", scorer: null },
  { id: 3, home: "Real Madrid", away: "Barcelona", score: "0-0", scorer: null }
];

// Initialize store on module load
loadMatches(seedMatches);

// Export the in-memory store reference used throughout the app
export const matches: Match[] = getMatchesStore();
