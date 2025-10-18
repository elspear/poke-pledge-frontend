async function postSignup(userData) {
    const url = `${import.meta.env.VITE_API_URL}/users/`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const fallbackError = `HTTP ${response.status}: Error trying to sign up`;

        try {
            // Try to get the response text first
            const responseText = await response.text();
            
            // Try to parse as JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                // If it's not JSON, treat the text as the error message
                const error = new Error(responseText || fallbackError);
                error.response = {
                    status: response.status,
                    statusText: response.statusText,
                    data: { detail: responseText }
                };
                throw error;
            }
            
            // Create a detailed error that preserves the response
            const error = new Error(data?.detail || fallbackError);
            error.response = {
                status: response.status,
                statusText: response.statusText,
                data: data
            };
            error.serverData = data;
            throw error;
        } catch (networkError) {
            // If there's a network error or other issue
            if (networkError.response) {
                // Re-throw if it's already our formatted error
                throw networkError;
            } else {
                const error = new Error(fallbackError);
                error.response = {
                    status: response.status,
                    statusText: response.statusText,
                    data: null
                };
                throw error;
            }
        }
    }

    return await response.json();
}

export default postSignup;