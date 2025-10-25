import { useEffect, useState } from "react";
import getSiteStats from "../api/get-site-stats";
import "./StatsBanner.css";

export default function StatsBanner() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await getSiteStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(err);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return null; // silently fail — banner is non-critical
  if (!stats) return null;

  // Format numbers simply (no heavy localization here)
  const fmt = (n) => (typeof n === "number" ? n.toLocaleString() : n);

  return (
    <div className="stats-banner" role="region" aria-label="Site statistics">
      <div className="stats-banner__inner">
        <div className="stat">Pokémon helped: <strong>{fmt(stats.total_pokemon_helped)}</strong></div>
        <div className="stat">Fundraisers: <strong>{fmt(stats.total_fundraisers)}</strong></div>
        <div className="stat">Pledges: <strong>{fmt(stats.total_pledges)}</strong></div>
        <div className="stat">Total pledged: <strong>${fmt(stats.total_amount_pledged)}</strong></div>
      </div>
    </div>
  );
}
