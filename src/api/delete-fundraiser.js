async function deleteFundraiser(fundraiserId) {
  const url = `${import.meta.env.VITE_API_URL}/fundraisers/${fundraiserId}`;
  const token = window.localStorage.getItem("token");
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      ...(token && { "Authorization": token.startsWith('Token') ? token : `Token ${token}` })
    },
  });

  if (!response.ok) {
    const fallbackError = `Error deleting fundraiser with id ${fundraiserId}`;
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
  }

  return true;
}

export default deleteFundraiser;
