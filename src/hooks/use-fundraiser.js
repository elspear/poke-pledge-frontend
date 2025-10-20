import { useState, useEffect } from "react";

import getFundraiser from "../api/get-fundraiser";

export default function useFundraiser(fundraiserId) {
  const [fundraiser, setFundraiser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const fetchFundraiser = () => {
    setIsLoading(true);
    getFundraiser(fundraiserId)
      .then((fundraiser) => {
        setFundraiser(fundraiser);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchFundraiser();
    // This time we pass the fundraiserId to the dependency array so that the hook will re-run if the fundraiserId changes.
  }, [fundraiserId]);

  return { fundraiser, isLoading, error, refetch: fetchFundraiser };
}