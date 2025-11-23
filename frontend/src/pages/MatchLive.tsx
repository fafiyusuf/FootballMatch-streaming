import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { openSSE } from "../services/api";
import { Match } from "../types/Match";

export default function MatchLive() {
  const { id } = useParams();
  const matchId = Number(id);

  const [match, setMatch] = useState<Match | null>(null);

  useEffect(() => {
    const events = openSSE(matchId, (data) => {
      setMatch(data);
    });

    return () => events.close();
  }, [matchId]);

  if (!match)
    return <div style={{ padding: "20px" }}>Connecting to live match...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <div style={{ marginBottom: "2rem", textAlign: "left" }}>
        <button onClick={() => window.history.back()} style={{ background: "transparent", border: "1px solid #333", color: "#fff" }}>
          ← Back to List
        </button>
      </div>

      <div className="match-card" style={{ padding: "3rem 2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
          <span className="live-indicator" style={{ width: "12px", height: "12px" }}></span>
          <span style={{ fontWeight: "bold", color: "#e74c3c" }}>LIVE NOW</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "2rem 0" }}>
          <div style={{ flex: 1, fontSize: "2rem", fontWeight: "bold" }}>{match.home}</div>
          <div className="score-badge" style={{ fontSize: "3rem", padding: "1rem 2rem" }}>{match.score}</div>
          <div style={{ flex: 1, fontSize: "2rem", fontWeight: "bold" }}>{match.away}</div>
        </div>

        {match.scorer && (
          <div style={{ 
            marginTop: "2rem", 
            padding: "1rem", 
            background: "rgba(46, 204, 113, 0.1)", 
            borderRadius: "8px",
            border: "1px solid var(--primary-green)",
            display: "inline-block"
          }}>
            <div style={{ fontSize: "0.9rem", color: "#888", marginBottom: "0.5rem" }}>LATEST EVENT</div>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--primary-green)" }}>
              ⚽ Goal by {match.scorer}!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
