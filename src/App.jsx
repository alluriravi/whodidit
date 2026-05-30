import { useState, useEffect } from "react";

const CATEGORIES = [
  { emoji: "🍽️", label: "Kitchen Crime", color: "#FF6B6B" },
  { emoji: "🛁", label: "Bathroom Battle", color: "#4ECDC4" },
  { emoji: "🧹", label: "Cleaning Chaos", color: "#FFE66D" },
  { emoji: "📺", label: "Living Room War", color: "#A29BFE" },
  { emoji: "🛏️", label: "Bedroom Drama", color: "#FD79A8" },
  { emoji: "🚗", label: "General Madness", color: "#55EFC4" },
];

const SUSPECTS = ["Everyone 🤷", "Husband 👨", "Wife 👩", "Kids 👧👦", "Dog 🐕", "Unknown 👻"];

export default function App() {
  const [complaint, setComplaint] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [suspect, setSuspect] = useState(SUSPECTS[0]);
  const [dramas, setDramas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("report");

  async function submitDrama() {
    if (!complaint.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are Lumi, a hilarious dramatic soap opera narrator for household complaints. 
Complaint: "${complaint}"
Category: ${category.label}
Suspect: ${suspect}
Respond in 3-4 sentences dramatically, funny, family friendly. End with "THE VERDICT: [funny verdict]"`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "Drama overload!";
      setDramas(prev => [{
        id: Date.now(),
        complaint, category, suspect,
        response: text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }, ...prev]);
      setComplaint("");
      setTab("feed");
    } catch {
      alert("Try again!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a0533, #2d1b69, #11998e)", fontFamily: "Georgia, serif", padding: "20px 16px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48 }}>🎭</div>
          <h1 style={{ color: "#FFE66D", fontSize: 32, margin: "8px 0 4px", fontStyle: "italic" }}>WhoDidIt?</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: 2 }}>YOUR HOUSEHOLD SOAP OPERA</p>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["report", "feed"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: 12, borderRadius: 12, cursor: "pointer",
              background: tab === t ? "rgba(255,230,109,0.15)" : "rgba(255,255,255,0.05)",
              border: `2px solid ${tab === t ? "rgba(255,230,109,0.5)" : "rgba(255,255,255,0.1)"}`,
              color: tab === t ? "#FFE66D" : "rgba(255,255,255,0.4)",
              fontSize: 13, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1
            }}>
              {t === "report" ? "📢 Report" : `📜 Feed ${dramas.length > 0 ? `(${dramas.length})` : ""}`}
            </button>
          ))}
        </div>
        {tab === "report" && (
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 20, border: "1px solid rgba(255,255,255,0.1)" }}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Crime Scene</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.label} onClick={() => setCategory(cat)} style={{
                  padding: "6px 12px", borderRadius: 16, cursor: "pointer", fontSize: 12,
                  background: category.label === cat.label ? `${cat.color}30` : "rgba(255,255,255,0.05)",
                  border: `2px solid ${category.label === cat.label ? cat.color : "rgba(255,255,255,0.1)"}`,
                  color: category.label === cat.label ? cat.color : "rgba(255,255,255,0.4)"
                }}>{cat.emoji} {cat.label}</button>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Suspect</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {SUSPECTS.map(s => (
                <button key={s} onClick={() => setSuspect(s)} style={{
                  padding: "6px 12px", borderRadius: 16, cursor: "pointer", fontSize: 12,
                  background: suspect === s ? "rgba(162,155,254,0.2)" : "rgba(255,255,255,0.05)",
                  border: `2px solid ${suspect === s ? "#A29BFE" : "rgba(255,255,255,0.1)"}`,
                  color: suspect === s ? "#A29BFE" : "rgba(255,255,255,0.4)"
                }}>{s}</button>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Your Complaint</p>
            <textarea
              value={complaint}
              onChange={e => setComplaint(e.target.value)}
              placeholder="e.g. Someone left the milk out AGAIN..."
              rows={3}
              style={{
                width: "100%", padding: 12, borderRadius: 12, fontSize: 14,
                background: "rgba(0,0,0,0.3)", border: "2px solid rgba(255,255,255,0.1)",
                color: "white", resize: "none", boxSizing: "border-box", fontFamily: "Georgia, serif"
              }}
            />
            <button onClick={submitDrama} disabled={loading || !complaint.trim()} style={{
              width: "100%", padding: 14, borderRadius: 12, marginTop: 12, cursor: "pointer",
              background: loading || !complaint.trim() ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #FF6B6B, #FFE66D)",
              border: "none", color: loading || !complaint.trim() ? "rgba(255,255,255,0.3)" : "#1a0533",
              fontSize: 15, fontWeight: "bold", fontFamily: "Georgia, serif"
            }}>
              {loading ? "🎭 Lumi is dramatizing..." : "🎬 File the Drama!"}
            </button>
          </div>
        )}
        {tab === "feed" && (
          <div>
            {dramas.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.3)" }}>
                <div style={{ fontSize: 40 }}>🎭</div>
                <p>No dramas yet!</p>
              </div>
            ) : dramas.map(drama => (
              <div key={drama.id} style={{
                background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 16, marginBottom: 12,
                border: "1px solid rgba(255,255,255,0.1)", borderLeft: `4px solid ${drama.category.color}`
              }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{ background: `${drama.category.color}20`, color: drama.category.color, borderRadius: 10, padding: "2px 10px", fontSize: 11 }}>
                    {drama.category.emoji} {drama.category.label}
                  </span>
                  <span style={{ background: "rgba(162,155,254,0.15)", color: "#A29BFE", borderRadius: 10, padding: "2px 10px", fontSize: 11 }}>
                    🔍 {drama.suspect}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginLeft: "auto" }}>{drama.time}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontStyle: "italic", background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "8px 12px", margin: "0 0 10px" }}>
                  "{drama.complaint}"
                </p>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  {drama.response}
                </p>
              </div>
            ))}
          </div>
        )}
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 11, marginTop: 20 }}>
          Made with ❤️ by Ravi • Powered by Lumi AI
        </p>
      </div>
    </div>
  );
}

