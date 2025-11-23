import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMatches, openAllMatchesSSE } from "../services/api";
import { Match } from "../types/Match";

export default function MatchList() {
  const [matches, setMatches] = useState<Match[]>([]);

  // Initial fetch (fallback in case SSE takes time or fails)
  useEffect(() => {
    fetchMatches().then(setMatches).catch(console.error);
  }, []);

  // Single SSE connection for all matches
  const sseRef = useRef<EventSource | null>(null);
  useEffect(() => {
    if (sseRef.current) return;
    sseRef.current = openAllMatchesSSE(
      (initial) => {
        // Prefer SSE init payload if present
        setMatches(initial);
      },
      (updated) => {
        setMatches((prev) => prev.map(m => m.id === updated.id ? { ...m, score: updated.score, scorer: updated.scorer } : m));
      }
    );
    return () => {
      sseRef.current?.close();
    };
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="nav-header">
        <h1>⚽ Live Matches</h1>
        <Link to="/admin" className="nav-link">Admin Panel</Link>
      </div>

      {matches.length === 0 && (
        <p style={{ color: "#888", marginTop: "2rem" }}>Loading matches...</p>
      )}
      
      <div style={{ display: "grid", gap: "1rem" }}>
        {matches.map((m) => (
          <Link
            key={m.id}
            to={`/match/${m.id}`}
            className="match-card"
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
              <span className="live-indicator"></span>
              <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", color: "#888" }}>LIVE</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", fontSize: "1.2rem", fontWeight: "bold" }}>
              <span style={{ flex: 1, textAlign: "right" }}>{m.home}</span>
              <span className="score-badge" style={{ margin: "0 1.5rem" }}>{m.score}</span>
              <span style={{ flex: 1, textAlign: "left" }}>{m.away}</span>
            </div>

            {m.scorer && (
              <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--primary-green)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>⚽</span>
                <span>Last Goal: {m.scorer}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
