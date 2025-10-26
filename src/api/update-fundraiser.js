async function updateFundraiser(fundraiserId, data) {
  const url = `${import.meta.env.VITE_API_URL}/fundraisers/${fundraiserId}`;
  const token = window.localStorage.getItem("token");
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": token.startsWith('Token') ? token : `Token ${token}` })
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const fallbackError = `Error updating fundraiser with id ${fundraiserId}`;
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
  }

  return await response.json();
}

export default updateFundraiser;
