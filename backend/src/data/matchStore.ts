import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Match } from "../types/Match.js";

const DATA_PATH = join(process.cwd(), "src/data/matches.json");

let matchesCache: Match[] | null = null;

export function loadMatches(initialFallback: Match[]): Match[] {
  if (matchesCache) return matchesCache;

  if (existsSync(DATA_PATH)) {
    try {
      const raw = readFileSync(DATA_PATH, "utf-8");
      const parsed = JSON.parse(raw) as Match[];
      matchesCache = parsed;
      return matchesCache;
    } catch (err) {
      console.error("Failed to read matches.json, using fallback seed", err);
      matchesCache = [...initialFallback];
      saveMatches();
      return matchesCache;
    }
  }

  matchesCache = [...initialFallback];
  saveMatches();
  return matchesCache;
}

export function getMatchesStore(): Match[] {
  if (!matchesCache) {
    throw new Error("Matches store not initialized. Call loadMatches() first.");
  }
  return matchesCache;
}

export function saveMatches() {
  if (!matchesCache) return;
  try {
    writeFileSync(DATA_PATH, JSON.stringify(matchesCache, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write matches.json", err);
  }
}
