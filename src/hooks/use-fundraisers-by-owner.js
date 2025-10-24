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
        if (!cancelled) {
          setFundraisers(data);
          setIsLoading(false);
        }
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
