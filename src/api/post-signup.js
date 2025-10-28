async function postSignup(userData) {
    const url = `${import.meta.env.VITE_API_URL}/users/`;
    
    console.log('Sending signup request to:', url);
    console.log('With data:', userData);
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    
    console.log('Signup response status:', response.status);
    
    const responseText = await response.text();
    console.log('Signup response text:', responseText);

    let data;
    try {
        data = JSON.parse(responseText);
    } catch (e) {
        // If it's not valid JSON, use the text as is
        data = { detail: responseText };
    }

    if (!response.ok) {
        const fallbackError = `HTTP ${response.status}: Error trying to sign up`;
        const error = new Error(data?.detail || fallbackError);
        error.response = {
            status: response.status,
            statusText: response.statusText,
            data: data
        };
        error.serverData = data;
        throw error;
    }
    console.log('Signup response:', data);
    return data;
}

export default postSignup;