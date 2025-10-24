import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";
import "./AvatarPicker.css";

/**
 * AvatarPicker
 * Props:
 * - avatars: optional array of { id, name, src, thumbnail }
 * - fetchUrl: optional URL to fetch a JSON manifest if avatars not provided
 * - initialSelectedId: optional id to preselect
 * - onClose: function() called when the picker is closed/cancelled
 * - onSave: function(selectedAvatar) called when user saves selection
 */
export default function AvatarPicker({ avatars: avatarsProp, fetchUrl, initialSelectedId, onClose, onSave }) {
  const [avatars, setAvatars] = useState(Array.isArray(avatarsProp) ? avatarsProp : []);
  const [selectedId, setSelectedId] = useState(initialSelectedId || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if ((!avatarsProp || avatarsProp.length === 0) && fetchUrl) {
      setLoading(true);
      fetch(fetchUrl)
        .then((r) => r.json())
        .then((data) => {
          if (!cancelled) {
            setAvatars(Array.isArray(data) ? data : []);
            setLoading(false);
          }
        })
        .catch((e) => {
          if (!cancelled) {
            setError(e);
            setLoading(false);
          }
        });
    }
    return () => {
      cancelled = true;
    };
  }, [avatarsProp, fetchUrl]);

  // sync prop changes
  useEffect(() => {
    if (Array.isArray(avatarsProp) && avatarsProp !== avatars) setAvatars(avatarsProp);
  }, [avatarsProp]);

  const handleTileKey = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedId(id);
    }
  };

  const handleSave = () => {
    const selected = avatars.find((a) => a.id === selectedId) || null;
    if (onSave) onSave(selected);
  };

  return (
    <div className="avatar-picker-overlay" role="dialog" aria-modal="true">
      <div className="avatar-picker-panel">
        <div className="avatar-picker-header">
          <h3>Choose an avatar</h3>
          <button className="avatar-picker-close" onClick={() => onClose && onClose()} aria-label="Close">
            ×
          </button>
        </div>

        {loading && <div className="avatar-picker-loading">Loading avatars…</div>}
        {error && <div className="avatar-picker-error">Failed to load avatars</div>}

        <div className="avatar-picker-grid" role="list">
          {avatars.map((a) => (
            <button
              key={a.id}
              type="button"
              role="listitem"
              className={`avatar-tile ${selectedId === a.id ? "selected" : ""}`}
              onClick={() => setSelectedId(a.id)}
              onKeyDown={(e) => handleTileKey(e, a.id)}
              aria-pressed={selectedId === a.id}
              title={a.name || a.id}
            >
              {a.thumbnail || a.src ? (
                <img src={a.thumbnail || a.src} alt={a.name || a.id} width={72} height={72} />
              ) : (
                <Avatar username={a.id} size={72} />
              )}
            </button>
          ))}
        </div>

        <div className="avatar-picker-actions">
          <button className="btn btn-secondary" onClick={() => onClose && onClose()}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!selectedId}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
