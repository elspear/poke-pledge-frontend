import { useState, useEffect, useCallback } from "react";

import getFundraiser from "../api/get-fundraiser";

export default function useFundraiser(fundraiserId) {
  const [fundraiser, setFundraiser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const fetchFundraiser = useCallback(() => {
    setIsLoading(true);
    getFundraiser(fundraiserId)
      .then((f) => {
        setFundraiser(f);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [fundraiserId]);

  useEffect(() => {
    fetchFundraiser();
  }, [fetchFundraiser]);

  return { fundraiser, isLoading, error, refetch: fetchFundraiser };
}