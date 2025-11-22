import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMatches } from "../services/api";
import { Match } from "../types/Match";

export default function MatchList() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetchMatches().then(setMatches);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>⚽ Live Football Matches</h1>

      {matches.map((m) => (
        <Link
          key={m.id}
          to={`/match/${m.id}`}
          style={{
            display: "block",
            padding: "10px",
            border: "1px solid #ddd",
            marginTop: "10px",
            textDecoration: "none",
            color: "black",
          }}
        >
          <strong>{m.home}</strong> vs <strong>{m.away}</strong>
          <br />
          <span>Score: {m.score}</span>
        </Link>
      ))}
    </div>
  );
}
