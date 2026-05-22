"use client";
import { useState, useRef } from "react";
import { SKILLS, formatXp } from "@/lib/osrs-data";

type SkillData = { rank: number; level: number; xp: number };
type HiscoresResult = { username: string; skills: Record<string, SkillData> };

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState<HiscoresResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lookup = async () => {
    const name = username.trim();
    if (!name) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/hiscores?username=" + encodeURIComponent(name));
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error fetching data");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") lookup(); };
  const overall = result?.skills["Overall"];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
      {/* Page header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--gold)", textShadow: "0 0 20px var(--gold-glow)", letterSpacing: "0.06em", marginBottom: 8 }}>
          ⚔️ OSRS Hiscores
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Consulta las stats de cualquier jugador en los Hiscores oficiales de OSRS
        </p>
      </div>

      {/* Search box */}
      <div className="osrs-panel" style={{ padding: 24, marginBottom: 24 }}>
        <div className="section-header"><span>🔍</span> Player Lookup</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            ref={inputRef}
            className="osrs-input"
            style={{ flex: 1, fontSize: "1rem" }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Enter username (e.g. Atenea WoW)..."
            maxLength={12}
          />
          <button
            className="osrs-btn-gold"
            style={{ padding: "8px 24px", fontSize: "0.9rem", fontWeight: "bold" }}
            onClick={() => lookup()}
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "48px 0", gap: 8 }}>
          <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(180,40,40,0.2)", border: "1px solid rgba(200,60,60,0.4)", borderRadius: 4, padding: "14px 20px", color: "#ff8888", textAlign: "center" }}>
          ⚠ {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          {/* Player header */}
          <div className="osrs-panel" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "var(--gold)" }}>{result.username}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  Overall rank {overall && overall.rank > 0 ? "#" + overall.rank.toLocaleString() : "unranked"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div className="stat-card">
                  <span className="value">{overall?.level?.toLocaleString() ?? "—"}</span>
                  <span className="label">Total Level</span>
                </div>
                <div className="stat-card">
                  <span className="value">{formatXp(overall?.xp ?? 0)}</span>
                  <span className="label">Total XP</span>
                </div>
                <div className="stat-card">
                  <span className="value" style={{ color: "#5ac050" }}>
                    {Object.values(result.skills).filter((s, i) => i > 0 && s.level >= 99).length}
                  </span>
                  <span className="label">99s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skill grid */}
          <div className="osrs-panel" style={{ padding: 16 }}>
            <div className="section-header">
              <span>📊</span> Skills
              <span style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "normal" }}>
                Hover for rank · Gold glow = 99
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(95px, 1fr))", gap: 4 }}>
              {SKILLS.map((skill) => {
                const data = result.skills[skill.name];
                if (!data) return null;
                const isMaxed = skill.name === "Overall" ? data.level >= 2277 : data.level >= 99;
                return (
                  <div
                    key={skill.name}
                    className={"skill-cell" + (isMaxed ? " maxed" : "")}
                    onMouseEnter={() => setTooltip(skill.name)}
                    onMouseLeave={() => setTooltip(null)}
                    style={{ background: isMaxed ? "linear-gradient(135deg,rgba(255,153,0,0.15),rgba(255,180,0,0.08))" : "rgba(0,0,0,0.2)", position: "relative" }}
                  >
                    <span style={{ fontSize: "1.1rem" }}>{skill.icon}</span>
                    <span style={{ fontSize: "0.62rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.2 }}>{skill.name}</span>
                    <span style={{ fontSize: "1rem", fontWeight: "bold", color: isMaxed ? "var(--gold-bright)" : "var(--text-primary)" }}>{data.level}</span>
                    {tooltip === skill.name && (
                      <div style={{ position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", background: "var(--bg-dark)", border: "1px solid var(--border-bright)", borderRadius: 3, padding: "4px 8px", fontSize: "0.72rem", whiteSpace: "nowrap", zIndex: 10, pointerEvents: "none" }}>
                        <div style={{ color: "var(--gold)" }}>Rank: {data.rank > 0 ? "#" + data.rank.toLocaleString() : "Unranked"}</div>
                        <div style={{ color: "var(--text-muted)" }}>XP: {data.xp.toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && !error && (
        <div className="empty-state">
          <span style={{ fontSize: "4rem" }}>🗡️</span>
          <div style={{ fontSize: "1.1rem", color: "var(--text-muted)" }}>Enter a player name to view their stats</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Data pulled live from the official OSRS Hiscores</div>
        </div>
      )}
    </div>
  );
}
