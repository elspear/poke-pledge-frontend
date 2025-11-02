async function updateFundraiser(fundraiserId, fundraiserData) {
  const url = `${import.meta.env.VITE_API_URL}/fundraisers/${fundraiserId}`;
  const token = window.localStorage.getItem("token");

  console.log('Raw fundraiser data received:', fundraiserData);
  console.log('Location from fundraiser data:', fundraiserData.location);

  // Process the data similar to post-fundraiser
  const { itemsNeeded, ...rest } = fundraiserData;
  const apiData = {
    ...rest,
    goal: parseFloat(fundraiserData.goal),
    items_needed: itemsNeeded,
    location: fundraiserData.location // Match how creation handles location
  };

  console.log('Final API data being sent:', apiData);
  console.log('Final location value:', apiData.location);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": token.startsWith('Token') ? token : `Token ${token}` })
    },
    body: JSON.stringify(apiData),
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
