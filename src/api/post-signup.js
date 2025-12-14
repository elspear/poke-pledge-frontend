async function postSignup(userData) {
    const url = `${import.meta.env.VITE_API_URL}/users/`;
    
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    
   
    
    const responseText = await response.text();
    

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