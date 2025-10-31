// API call to post a pledge
export default async function postPledge({ amount, comment = "", anonymous, fundraiser }) {
  const url = `${import.meta.env.VITE_API_URL}/pledges/`;
  const token = window.localStorage.getItem("token");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": token.startsWith('Token') ? token : `Token ${token}` })
    },
    body: JSON.stringify({ amount, comment, anonymous, fundraiser }),
  });
  if (!response.ok) {
    const data = await response.json();
    console.error('Pledge submission error details:', {
      status: response.status,
      data: data,
      sentData: { amount, comment, anonymous, fundraiser }
    });
    const errorMessage = data.detail || data.error || JSON.stringify(data);
    throw new Error(errorMessage || "Failed to submit pledge");
  }
  return await response.json();
}
