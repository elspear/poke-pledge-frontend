import { useEffect, useState } from "react";
import getSiteStats from "../api/get-site-stats";
import "./StatsBanner.css";

export default function StatsBanner() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({
    total_pokemon_helped: 0,
    total_users: 0,
    total_fundraisers: 0,
    total_pledges: 0,
    total_amount_pledged: 0
  });

  // Load initial stats
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

  // Animate stats when they change
  useEffect(() => {
    if (!stats) return;
    
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const animate = () => {
      for (let i = 0; i <= steps; i++) {
        setTimeout(() => {
          setAnimatedStats({
            total_pokemon_helped: Math.round((stats.total_pokemon_helped * i) / steps),
            total_users: Math.round((stats.total_users * i) / steps),
            total_fundraisers: Math.round((stats.total_fundraisers * i) / steps),
            total_pledges: Math.round((stats.total_pledges * i) / steps),
            total_amount_pledged: Math.round((stats.total_amount_pledged * i) / steps)
          });
        }, i * interval);
      }
    };

    animate();
  }, [stats]);

  if (error) return null;
  if (!stats) return null;

  const fmt = (n) => (typeof n === "number" ? n.toLocaleString() : n);

  return (
    <div className="stats-banner" role="region" aria-label="Site statistics">
      <div className="stats-banner__inner">
        <div className="stat">Pokémon helped: <strong>{fmt(animatedStats.total_pokemon_helped)}</strong></div>
        <div className="stat">PokePledge users: <strong>{fmt(animatedStats.total_users)}</strong></div>
        <div className="stat">Fundraisers: <strong>{fmt(animatedStats.total_fundraisers)}</strong></div>
        <div className="stat">Pledges:<strong>{fmt(animatedStats.total_pledges)}</strong></div>
        <div className="stat">Total pledged:<strong>${fmt(animatedStats.total_amount_pledged)}</strong></div>
      </div>
    </div>
  );
}