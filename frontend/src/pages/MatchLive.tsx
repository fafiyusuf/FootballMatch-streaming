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
    <div style={{ padding: "20px" }}>
      <h1>
        LIVE: {match.home} vs {match.away}
      </h1>

      <h2>Score: {match.score}</h2>

      {match.scorer && (
        <p>
          <strong>Last Goal:</strong> {match.scorer}
        </p>
      )}

      <button
        onClick={() => window.history.back()}
        style={{
          marginTop: "20px",
          padding: "8px 16px",
          cursor: "pointer",
        }}
      >
        🔙 Back
      </button>
    </div>
  );
}
