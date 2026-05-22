"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Navigation links
const links = [
  { href: "/", label: "⚔ Hiscores" },
  { href: "/dashboard", label: "📋 Dashboard" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="osrs-nav" style={{ height: 60 }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.5rem" }}>🗡️</span>
          <span
            style={{
              color: "var(--gold)",
              fontWeight: "bold",
              fontSize: "1.1rem",
              textShadow: "0 0 10px var(--gold-glow)",
              letterSpacing: "0.05em",
            }}
          >
            OSRS Tracker
          </span>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 4 }}>
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: "6px 16px",
                  borderRadius: 3,
                  color: active ? "var(--gold)" : "var(--text-muted)",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  border: `1px solid ${active ? "var(--border-bright)" : "transparent"}`,
                  background: active
                    ? "linear-gradient(180deg, var(--bg-panel-light) 0%, var(--bg-panel-mid) 100%)"
                    : "transparent",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
