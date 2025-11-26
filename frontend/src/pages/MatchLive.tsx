import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaFutbol } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { fetchMatches, openAllMatchesSSE, openSSE } from "../services/api";
import { Match } from "../types/Match";

// --- Utility component for the match card in the sidebar ---
const SidebarMatchCard = ({ match, selectedId }: { match: Match, selectedId: number }) => (
    <Link
      to={`/match/${match.id}`}
      style={{
        display: "block",
        textDecoration: "none",
        color: "#fff",
        padding: "10px",
        margin: "5px 0",
        borderRadius: "6px",
        background: match.id === selectedId ? "#2ecc71" : "#1c1c1c", // Highlight selected match with green
        border: match.id === selectedId ? "1px solid #2ecc71" : "1px solid #333",
        transition: "background 0.2s",
      }}
      onMouseOver={(e) => { if (match.id !== selectedId) e.currentTarget.style.background = '#333'; }}
      onMouseOut={(e) => { if (match.id !== selectedId) e.currentTarget.style.background = '#1c1c1c'; }}
    >
      <div style={{ fontSize: "0.9rem", color: match.id === selectedId ? "#000" : "#aaa", marginBottom: "5px" }}>
        {match.home} vs {match.away}
      </div>
      <div style={{ fontWeight: "bold", fontSize: "1.2rem", color: match.id === selectedId ? "#000" : "#fff" }}>
        {match.score}
      </div>
    </Link>
);


export default function MatchLive() {
  const { id } = useParams();
  const matchId = Number(id);

  // State for the currently viewed match's live data
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  // State for the list of all matches (for the sidebar)
  const [allMatches, setAllMatches] = useState<Match[]>([]);

  // 1. SSE for the *current* match's detailed updates
  useEffect(() => {
    // This will fetch the initial data and then listen for specific updates
    const events = openSSE(matchId, (data) => {
      setCurrentMatch(data);
    });

    return () => events.close();
  }, [matchId]);

  // 2. SSE/Fetch for *all* matches (for the sidebar list)
  const sseRef = useRef<EventSource | null>(null);
  useEffect(() => {
    // Initial fetch for fallback/initial load
    fetchMatches().then(setAllMatches).catch(console.error);

    if (sseRef.current) return;

    // Single SSE connection for all matches list updates
    sseRef.current = openAllMatchesSSE(
      (initial) => {
        setAllMatches(initial);
      },
      (updated) => {
        // Update the list of all matches
        setAllMatches((prev) => prev.map(m => m.id === updated.id ? { ...m, score: updated.score, scorer: updated.scorer } : m));
      }
    );
    return () => {
      sseRef.current?.close();
    };
  }, []); // Run only once

  if (!currentMatch)
    return <div style={{ padding: "20px", textAlign: "center" }}>Connecting to live match...</div>;

  return (
    <div style={{ display: "flex", minHeight: "100vh",background: "#000" }}>
      {/* ⚽ Match Sidebar (Persistent List) */}
      <div 
        style={{ 
          width: "300px", 
          minWidth: "300px", 
          background: "#111", 
          borderRight: "1px solid #333", 
          padding: "15px", 
          overflowY: "auto",
          boxShadow: "2px 0 10px rgba(0, 0, 0, 0.5)"
        }}
      >
        <h3 style={{ color: "#2ecc71", borderBottom: "1px solid #333", paddingBottom: "10px", marginTop: 0, marginBottom: "15px" }}>
            All Live Matches
        </h3>
        {allMatches.length === 0 ? (
            <p style={{color: '#888'}}>No matches currently live.</p>
        ) : (
            <div>
                {allMatches.map(m => (
                    <SidebarMatchCard key={m.id} match={m} selectedId={matchId} />
                ))}
            </div>
        )}
        <div style={{ marginTop: "20px", paddingTop: "10px", borderTop: "1px solid #333" }}>
            <Link
              to="/"
              style={{
                color: "#aaa",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                width: "100%",
                padding: "10px",
              }}
            >
                <FaArrowLeft />
                <span>Full List View</span>
            </Link>
        </div>
      </div>

      {/* 🏟️ Main Match View */}
      <div style={{ flex: 1, padding: "20px", background: "#000" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
            <span className="live-indicator" style={{ width: "12px", height: "12px", background: "#e74c3c", borderRadius: "50%" }}></span>
            <span style={{ fontWeight: "bold", color: "#e74c3c", fontSize: "1.1rem", marginLeft: "8px" }}>LIVE NOW</span>
          </div>

          <div className="match-card" style={{ 
            padding: "4rem 2rem", 
            background: "#1c1c1c", 
            borderRadius: "15px",
            border: "1px solid #333",
            color: "#fff",
          }}>
            <h1 style={{ marginBottom: "3rem", fontSize: "2.5rem" }}>{currentMatch.home} vs {currentMatch.away}</h1>

            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", margin: "2rem 0" }}>
              <div style={{ flex: 1, fontSize: "2.5rem", fontWeight: "bold" }}>{currentMatch.home}</div>
              <div className="score-badge" style={{ 
                fontSize: "4rem", 
                padding: "1rem 3rem", 
                background: "#2ecc71", 
                color: "#fff",
                borderRadius: "12px",
                fontWeight: "900",
                boxShadow: "0 0 15px rgba(46, 204, 113, 0.5)"
              }}>
                {currentMatch.score}
              </div>
              <div style={{ flex: 1, fontSize: "2.5rem", fontWeight: "bold" }}>{currentMatch.away}</div>
            </div>

            {/* Enhanced Scorer Display for Persistence */}
            {currentMatch.scorer && (
              <div style={{ 
                marginTop: "3rem", 
                padding: "1.5rem", 
                background: "#151515", // Darker background to look like a persistent event log item
                borderRadius: "10px",
                border: "1px solid #2ecc71", // Green border for emphasis
                boxShadow: "0 0 8px rgba(46, 204, 113, 0.2)",
                display: "block", 
                textAlign: "left"
              }}>
                <div style={{ 
                  fontSize: "0.9rem", 
                  color: "#2ecc71", // Green text for 'EVENT' header
                  marginBottom: "0.75rem", 
                  textTransform: "uppercase",
                  fontWeight: "bold" 
                }}>
              <FaFutbol />
              <span>LATEST GOAL</span>
                </div>
                <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#fff" }}>
                   Scored by: {currentMatch.scorer}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}