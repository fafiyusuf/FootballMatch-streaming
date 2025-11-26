import { useEffect, useState } from "react";
import { FaBroadcastTower, FaExternalLinkAlt, FaPlus, FaTools, FaTrashAlt } from "react-icons/fa";
import { createMatch, deleteMatch, fetchMatches, updateMatch } from "../services/api";
import type { Match } from "../types/Match";

export default function AdminMatchUpdate() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);
  const [scorer, setScorer] = useState("");
  const [message, setMessage] = useState("");
  const [newHome, setNewHome] = useState("");
  const [newAway, setNewAway] = useState("");

  useEffect(() => {
    fetchMatches().then(setMatches).catch(console.error);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId == null) return;
    try {
      await updateMatch(selectedId, homeGoals, awayGoals, scorer || null);
      setMessage("Update sent successfully!");
      // Scorer state now persists, allowing the admin to only update goals.
      fetchMatches().then(setMatches).catch(console.error);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update match.");
    }
  };

  const submitNewMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHome.trim() || !newAway.trim()) return;
    try {
      await createMatch(newHome.trim(), newAway.trim());
      setMessage("Match created successfully!");
      setNewHome("");
      setNewAway("");
      fetchMatches().then(setMatches).catch(console.error);
    } catch (err) {
      console.error(err);
      setMessage("Failed to create match.");
    }
  };

  const handleDelete = async () => {
    if (selectedId == null) return;
    try {
      await deleteMatch(selectedId);
      setMessage("Match deleted successfully!");
      setSelectedId(null);
      fetchMatches().then(setMatches).catch(console.error);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete match.");
    }
  };

  return (
    <div style={{ margin: "0 auto", padding: "2rem", background: "#000", height: "100vh" }}>
      <div className="nav-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FaTools />
          <span>Admin Dashboard</span>
        </h2>
        <a href="/" className="nav-link" style={{ textDecoration: "none", color: "#2ecc71", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
          <span>View Site</span>
          <FaExternalLinkAlt size={10} />
        </a>
      </div>

      <div className="match-card" style={{ 
        alignItems: "stretch", 
        background: "#1c1c1c", 
        borderRadius: "12px", 
        padding: "2rem",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
        border: "1px solid #333",
        width: "700px",
        margin: "0 auto",
        height: "700px"
      }}>
        <h3 style={{ marginTop: 0, marginBottom: "1.5rem", textAlign: "center", color: "#fff" }}>Manage Live Scores</h3>
        
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
                  setScorer(m.scorer || ""); // Load existing scorer
              }
          }}
          style={{ 
            padding: "1rem", 
            marginBottom: "1.5rem", 
            background: "#000", 
            color: "#fff", 
            border: "1px solid #555",
            borderRadius: "8px",
            width: "100%",
            fontSize: "1rem"
          }}
        >
          <option value="" disabled>Select a match to update...</option>
          {matches.map(m => (
            <option key={m.id} value={m.id}>
              [{m.score}] {m.home} vs {m.away}
            </option>
          ))}
        </select>

        {selectedId && (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#aaa", fontSize: "0.9rem" }}>Home Goals</label>
                <input
                    type="number"
                    value={homeGoals}
                    onChange={e => setHomeGoals(Number(e.target.value))}
                    min={0}
                    style={{ 
                      padding: "1rem", 
                      width: "100%", 
                      background: "#000", 
                      border: "1px solid #555", 
                      color: "#2ecc71", // Highlight goal input
                      borderRadius: "8px",
                      fontSize: "1.5rem",
                      textAlign: "center",
                      boxSizing: "border-box"
                    }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#aaa", fontSize: "0.9rem" }}>Away Goals</label>
                <input
                    type="number"
                    value={awayGoals}
                    onChange={e => setAwayGoals(Number(e.target.value))}
                    min={0}
                    style={{ 
                      padding: "1rem", 
                      width: "100%", 
                      background: "#000", 
                      border: "1px solid #555", 
                      color: "#2ecc71", // Highlight goal input
                      borderRadius: "8px",
                      fontSize: "1.5rem",
                      textAlign: "center",
                      boxSizing: "border-box"
                    }}
                />
              </div>
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "#aaa", fontSize: "0.9rem" }}>Latest Scorer (Optional, persists)</label>
                <input
                  type="text"
                  value={scorer}
                  onChange={e => setScorer(e.target.value)}
                  placeholder="Player name (e.g., Messi)"
                  style={{ 
                    padding: "1rem", 
                    width: "100%", 
                    background: "#000", 
                    border: "1px solid #555", 
                    color: "#fff", 
                    borderRadius: "8px",
                    fontSize: "1rem",
                    boxSizing: "border-box"
                  }}
                />
            </div>
            
            <button
              type="submit"
              style={{
                padding: "1rem",
                fontSize: "1.1rem",
                marginTop: "1rem",
                background: "#2ecc71",
                color: "#000",
                fontWeight: "bold",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                justifyContent: "center",
              }}
            >
              <FaBroadcastTower />
              <span>Broadcast Update</span>
            </button>
            <button
              type="button"
              onClick={handleDelete}
              style={{
                padding: "0.75rem",
                fontSize: "0.95rem",
                background: "#c0392b",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                justifyContent: "center",
              }}
            >
              <FaTrashAlt />
              <span>Delete Match</span>
            </button>
          </form>
        )}
        <hr style={{ margin: "2.5rem 0", borderColor: "#333" }} />

        <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#fff" }}>Add New Match</h3>
        <form onSubmit={submitNewMatch} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#aaa", fontSize: "0.9rem" }}>Home Team</label>
            <input
              type="text"
              value={newHome}
              onChange={(e) => setNewHome(e.target.value)}
              placeholder="Home team name"
              style={{ 
                padding: "0.75rem", 
                width: "100%", 
                background: "#000", 
                border: "1px solid #555", 
                color: "#fff", 
                borderRadius: "8px",
                fontSize: "1rem",
                boxSizing: "border-box"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#aaa", fontSize: "0.9rem" }}>Away Team</label>
            <input
              type="text"
              value={newAway}
              onChange={(e) => setNewAway(e.target.value)}
              placeholder="Away team name"
              style={{ 
                padding: "0.75rem", 
                width: "100%", 
                background: "#000", 
                border: "1px solid #555", 
                color: "#fff", 
                borderRadius: "8px",
                fontSize: "1rem",
                boxSizing: "border-box"
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "0.9rem",
              fontSize: "1rem",
              background: "#3498db",
              color: "#000",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              justifyContent: "center",
            }}
          >
            <FaPlus />
            <span>Add Match</span>
          </button>
        </form>
        {message && (
          <div style={{ 
            marginTop: "1.5rem", 
            padding: "1rem", 
            background: message.includes("Failed") ? "rgba(192, 57, 43, 0.2)" : "rgba(46, 204, 113, 0.2)", 
            color: message.includes("Failed") ? "#c0392b" : "#2ecc71",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: "bold"
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}