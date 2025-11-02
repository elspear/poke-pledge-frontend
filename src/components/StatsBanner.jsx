import { useEffect, useState } from "react";
import getSiteStats from "../api/get-site-stats";
import "./StatsBanner.css";

// Formatter function to format numbers with commas
const fmt = (n) => (typeof n === "number" ? n.toLocaleString() : n);

function StatsBanner() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({
    total_pokemon_helped: 0,
    total_users: 0,
    total_fundraisers: 0,
    total_pledges: 0,
    total_amount_pledged: 0
  });

  // Load initial stats and set up polling
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
    // Initial load
    load();

    // Set up polling every 30 seconds
    const interval = setInterval(load, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Animate stats when they change
  useEffect(() => {
    if (!stats) return;
    
    const startTime = performance.now();
    const duration = 2000;
    let animationFrame;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setAnimatedStats({
        total_pokemon_helped: Math.round(stats.total_pokemon_helped * progress),
        total_users: Math.round(stats.total_users * progress),
        total_fundraisers: Math.round(stats.total_fundraisers * progress),
        total_pledges: Math.round(stats.total_pledges * progress),
        total_amount_pledged: Math.round(stats.total_amount_pledged * progress)
      });

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [stats]);
  


  if (error) return (
    <div className="stats-banner stats-banner--error" role="alert">
      Unable to load stats
    </div>
  );
  
  if (!stats) return (
    <div className="stats-banner stats-banner--loading" role="status">
      Loading stats...
    </div>
  );

  return (
    <div className="stats-banner" role="region" aria-label="Site statistics">
      <div className="stats-banner__inner">
        <div className="stat">Pokémon helped: <strong>{fmt(animatedStats.total_pokemon_helped)}</strong></div>
        <div className="stat">PokePledge users: <strong>{fmt(animatedStats.total_users)}</strong></div>
        <div className="stat">Fundraisers: <strong>{fmt(animatedStats.total_fundraisers)}</strong></div>
        <div className="stat">Pledges: <strong>{fmt(animatedStats.total_pledges)}</strong></div>
        <div className="stat">Total pledged: <strong>${fmt(animatedStats.total_amount_pledged)}</strong></div>
      </div>
    </div>
  );
}

export default StatsBanner;