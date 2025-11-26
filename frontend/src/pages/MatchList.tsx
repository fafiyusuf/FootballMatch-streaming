import { useEffect, useRef, useState } from "react";
import { FaFutbol } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchMatches, openAllMatchesSSE } from "../services/api";
import { Match } from "../types/Match";

// --- New Global Styles/Classes Assumption (replace with your actual CSS) ---
// .nav-header: Existing style for header
// .live-indicator: Existing animated dot

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
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <div className="nav-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #333", padding: "10px 0", margin: 0 }}>
          <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaFutbol />
            <span>Live Football Scores</span>
          </h1>
        <Link to="/admin" className="nav-link" style={{ 
          background: "#1e8449", // A deeper green for Admin button
          padding: "8px 15px",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "bold",
          color: "#fff"
        }}>Admin Panel</Link>
      </div>

      {matches.length === 0 && (
        <p style={{ color: "#888", marginTop: "2rem", textAlign: "center" }}>Loading live matches...</p>
      )}
      
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", padding: "0 10px 10px 10px", margin: 0 }}>
        {matches.map((m) => (
          <Link
            key={m.id}
            to={`/match/${m.id}`}
            style={{
              textDecoration: "none",
              color: "#fff",
              background: "#1c1c1c", // Dark background for card
              borderRadius: "12px",
              padding: "1.5rem",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "flex",
              flexDirection: "column",
              border: "1px solid #333",
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.6)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.4)'; }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="live-indicator" style={{ 
                  background: "#e74c3c", 
                  width: "10px", 
                  height: "10px", 
                  borderRadius: "50%", 
                  marginRight: "5px",
                  animation: "blink 1.5s infinite" // Assuming you define a blink animation in CSS
                }}></span>
                <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", color: "#e74c3c", fontWeight: "bold" }}>LIVE</span>
              </div>
              <span style={{ fontSize: "0.9rem", color: "#aaa" }}>Match ID: {m.id}</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.home}</span>
              <span style={{ margin: "0 1rem", fontSize: "2rem", color: "#2ecc71" }}>{m.score}</span> {/* Highlight score */}
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.away}</span>
            </div>
            <div style={{ marginTop: "1rem", borderTop: "1px solid #333", paddingTop: "0.75rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#888" }}>Tap to view live updates</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}