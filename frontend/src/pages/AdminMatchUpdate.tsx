import { useEffect, useState } from "react";
import { fetchMatches, updateMatch } from "../services/api";
import type { Match } from "../types/Match";

export default function AdminMatchUpdate() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);
  const [scorer, setScorer] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMatches().then(setMatches).catch(console.error);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId == null) return;
    try {
      await updateMatch(selectedId, homeGoals, awayGoals, scorer || null);
      setMessage("Update sent successfully!");
      // Refresh matches to show updated score in dropdown
      fetchMatches().then(setMatches).catch(console.error);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update match.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <div className="nav-header">
        <h2>Admin Dashboard</h2>
        <a href="/" className="nav-link">View Site</a>
      </div>

      <div className="match-card" style={{ alignItems: "stretch" }}>
        <h3 style={{ marginTop: 0, marginBottom: "1.5rem", textAlign: "center" }}>Update Match Score</h3>
        
        <select 
          value={selectedId ?? ""} 
          onChange={e => {
              const id = Number(e.target.value);
              setSelectedId(id);
              const m = matches.find(match => match.id === id);
              if (m) {
                  const [h, a] = m.score.split('-').map(Number);
                  setHomeGoals(h || 0);
                  setAwayGoals(a || 0);
              }
          }}
          style={{ 
            padding: "1rem", 
            marginBottom: "1.5rem", 
            background: "#000", 
            color: "#fff", 
            border: "1px solid #333",
            borderRadius: "8px",
            width: "100%",
            fontSize: "1rem"
          }}
        >
          <option value="" disabled>Select a match to update...</option>
          {matches.map(m => (
            <option key={m.id} value={m.id}>
              {m.home} vs {m.away}
            </option>
          ))}
        </select>

        {selectedId && (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#888", fontSize: "0.9rem" }}>Home Goals</label>
                <input
                    type="number"
                    value={homeGoals}
                    onChange={e => setHomeGoals(Number(e.target.value))}
                    min={0}
                    style={{ 
                      padding: "1rem", 
                      width: "100%", 
                      background: "#000", 
                      border: "1px solid #333", 
                      color: "#fff", 
                      borderRadius: "8px",
                      fontSize: "1.5rem",
                      textAlign: "center",
                      boxSizing: "border-box"
                    }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#888", fontSize: "0.9rem" }}>Away Goals</label>
                <input
                    type="number"
                    value={awayGoals}
                    onChange={e => setAwayGoals(Number(e.target.value))}
                    min={0}
                    style={{ 
                      padding: "1rem", 
                      width: "100%", 
                      background: "#000", 
                      border: "1px solid #333", 
                      color: "#fff", 
                      borderRadius: "8px",
                      fontSize: "1.5rem",
                      textAlign: "center",
                      boxSizing: "border-box"
                    }}
                />
              </div>
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#888", fontSize: "0.9rem" }}>Latest Scorer</label>
                <input
                  type="text"
                  value={scorer}
                  onChange={e => setScorer(e.target.value)}
                  placeholder="Player name"
                  style={{ 
                    padding: "1rem", 
                    width: "100%", 
                    background: "#000", 
                    border: "1px solid #333", 
                    color: "#fff", 
                    borderRadius: "8px",
                    fontSize: "1rem",
                    boxSizing: "border-box"
                  }}
                />
            </div>
            
            <button type="submit" style={{ padding: "1rem", fontSize: "1.1rem", marginTop: "1rem" }}>
              Broadcast Update 📡
            </button>
          </form>
        )}
        {message && (
          <div style={{ 
            marginTop: "1.5rem", 
            padding: "1rem", 
            background: message.includes("Failed") ? "rgba(231, 76, 60, 0.2)" : "rgba(46, 204, 113, 0.2)", 
            color: message.includes("Failed") ? "#e74c3c" : "#2ecc71",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
