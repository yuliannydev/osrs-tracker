import { NextRequest, NextResponse } from "next/server";
import { SKILLS } from "@/lib/osrs-data";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  try {
    // OSRS official hiscores CSV endpoint
    const url = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${encodeURIComponent(username)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "OSRS-Tracker/1.0" },
      next: { revalidate: 60 }, // cache 60s
    });

    if (res.status === 404) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }
    if (!res.ok) {
      return NextResponse.json({ error: "Hiscores unavailable" }, { status: 502 });
    }

    const text = await res.text();
    const lines = text.trim().split("\n");

    // Parse CSV: rank,level,xp per line, one per skill
    const skills: Record<string, { rank: number; level: number; xp: number }> = {};
    SKILLS.forEach((skill, i) => {
      const parts = lines[i]?.split(",");
      if (parts) {
        skills[skill.name] = {
          rank:  parseInt(parts[0]) || -1,
          level: parseInt(parts[1]) || 1,
          xp:    parseInt(parts[2]) || 0,
        };
      }
    });

    return NextResponse.json({ username, skills });
  } catch (err) {
    console.error("Hiscores error:", err);
    return NextResponse.json({ error: "Failed to fetch hiscores" }, { status: 500 });
  }
}
