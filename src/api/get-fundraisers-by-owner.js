async function getFundraisersByOwner(owner) {
  // owner may be a numeric id or a username string
  if (!owner) return [];

  const base = import.meta.env.VITE_API_URL;
  // choose query param based on whether owner looks like an integer
  const isNumeric = /^\d+$/.test(String(owner));
  const q = isNumeric ? `owner=${owner}` : `owner_username=${encodeURIComponent(owner)}`;
  const url = `${base}/fundraisers/?${q}`;

  const response = await fetch(url, { method: "GET" });

  if (!response.ok) {
    const fallbackError = `Error fetching fundraisers for owner ${owner}`;
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
  }

  return await response.json();
}

export default getFundraisersByOwner;
