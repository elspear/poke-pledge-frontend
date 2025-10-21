async function postFundraiser(fundraiserData) {
    const url = `${import.meta.env.VITE_API_URL}/fundraisers/`;

    // Get token from localStorage for authentication
    const token = window.localStorage.getItem("token");

    const { itemsNeeded, ...rest } = fundraiserData;
    const apiData = {
        ...rest,
        goal: parseFloat(fundraiserData.goal),
    };

    // Only include items_needed if the caller provided a non-empty value
    if (itemsNeeded !== undefined && itemsNeeded !== null && String(itemsNeeded).trim() !== "") {
        apiData.items_needed = itemsNeeded;
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": token })
        },
        body: JSON.stringify(apiData)
    });

    console.log("API Response status:", response.status);
    console.log("API Response ok:", response.ok);

    if (!response.ok) {
        const fallbackError = `HTTP ${response.status}: Error creating fundraiser`;

        try {
            // Try to get the response text first
            const responseText = await response.text();
            console.log("Server error response:", responseText);
            
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

export default postFundraiser;