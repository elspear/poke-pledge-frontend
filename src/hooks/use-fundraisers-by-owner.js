import { useState, useEffect } from "react";

import getFundraisersByOwner from "../api/get-fundraisers-by-owner";

export default function useFundraisersByOwner(owner) {
  const [fundraisers, setFundraisers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    let cancelled = false;
    if (!owner) {
      setFundraisers([]);
      setIsLoading(false);
      setError(undefined);
      return;
    }

    setIsLoading(true);
    getFundraisersByOwner(owner)
      .then((data) => {
        if (cancelled) return;

        // (debug logs removed) 

        // Defensive client-side filtering: some backends may ignore the owner query
        // parameter and return all fundraisers. Filter the returned array to only
        // include fundraisers that match the requested owner identifier.
        const isNumericOwner = /^\d+$/.test(String(owner));
        const filtered = Array.isArray(data)
          ? data.filter((f) => {
              // fundraiser may have various shapes: owner (id), owner (object with id or username), owner_username
              const ownerField = f.owner;
              const ownerUsernameField = f.owner_username || (ownerField && ownerField.username) || f.owner_username_text;

              if (isNumericOwner) {
                const numericOwner = Number(owner);
                // Match if owner is a number or an object containing id
                if (typeof ownerField === "number") return Number(ownerField) === numericOwner;
                if (ownerField && typeof ownerField === "object" && (ownerField.id || ownerField.pk)) {
                  return Number(ownerField.id || ownerField.pk) === numericOwner;
                }
                // Some APIs use owner_id or user fields
                if (f.owner_id) return Number(f.owner_id) === numericOwner;
                if (f.user_id) return Number(f.user_id) === numericOwner;
                // Last resort: compare stringified owner
                return String(ownerField) === String(owner);
              }

              // Non-numeric owner: match by username
              if (typeof ownerField === "string") return ownerField === owner;
              if (ownerUsernameField) return ownerUsernameField === owner;
              if (ownerField && typeof ownerField === "object" && ownerField.username) return ownerField.username === owner;
              return false;
            })
          : [];

        setFundraisers(filtered);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [owner]);

  return { fundraisers, isLoading, error };
}
