import React from "react";
import "./Avatar.css";

// Small deterministic hash to pick a color from a palette
function hashStringToNumber(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function pickColorFromString(str) {
  const palette = [
    "#7f9cf5",
    "#f687b3",
    "#f6ad55",
    "#9ae6b4",
    "#63b3ed",
    "#f56565",
    "#ed64a6",
    "#68d391",
    "#90cdf4",
  ];
  const idx = hashStringToNumber(str || "") % palette.length;
  return palette[idx];
}

function getInitials(nameOrUsername) {
  if (!nameOrUsername) return "?";
  const parts = nameOrUsername.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

/**
 * Avatar component
 * Props:
 * - avatar: optional object with shape { type: 'upload'|'library'|'generated', url, generated: { provider, style, seed }, id }
 * - src: legacy direct image URL (e.g. profile.image)
 * - username: for initials fallback and deterministic color
 * - size: pixel size (number) default 64
 * - alt: alt text
 */
export default function Avatar({ avatar, src, username, size = 64, alt }) {
  const finalAlt = alt || `Avatar for ${username || "user"}`;

  // 1) uploaded URL
  if (avatar && avatar.type === "upload" && avatar.url) {
    return <img className="app-avatar" src={avatar.url} alt={finalAlt} style={{ width: size, height: size }} />;
  }

  // 2) explicit src (legacy `profile.image`)
  if (src) {
    return <img className="app-avatar" src={src} alt={finalAlt} style={{ width: size, height: size }} />;
  }

  // 3) library selection (avatar.id or avatar.type === 'library') - caller should resolve id->src,
  //    but support if avatar.src is provided
  if (avatar && avatar.type === "library" && avatar.id && avatar.src) {
    return <img className="app-avatar" src={avatar.src} alt={finalAlt} style={{ width: size, height: size }} />;
  }

  // 4) generated provider (DiceBear)
  if (avatar && avatar.type === "generated" && avatar.generated) {
    const gen = avatar.generated;
    if (gen.provider === "dicebear") {
      const style = gen.style || "adventurer";
      const seed = gen.seed || username || "user";
      const url = `https://avatars.dicebear.com/api/${encodeURIComponent(style)}/${encodeURIComponent(seed)}.svg`;
      return <img className="app-avatar" src={url} alt={finalAlt} style={{ width: size, height: size }} />;
    }
  }

  // Fallback: initials with deterministic background color
  const initials = getInitials(username || (avatar && avatar.initials && avatar.initials.text) || "?");
  const bg = pickColorFromString(username || (avatar && avatar.initials && avatar.initials.text) || "?");

  return (
    <div
      className="app-avatar app-avatar-initials"
      style={{ width: size, height: size, backgroundColor: bg }}
      role="img"
      aria-label={finalAlt}
    >
      <span className="app-avatar-initials-text">{initials}</span>
    </div>
  );
}
