// =========================================================
// PULSECARE API CLIENT
// =========================================================

const API_BASE_URL = "/api";


// =========================================================
// GENERIC API REQUEST
// =========================================================

async function apiRequest(endpoint, options = {}) {

    const config = {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    };


    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        config
    );


    let data;

    try {

        data = await response.json();

    } catch {

        data = {
            success: false,
            message: "Invalid server response"
        };

    }


    if (!response.ok) {

        throw new Error(
            data.message || "Something went wrong"
        );

    }


    return data;

}


// =========================================================
// AUTH API
// =========================================================

const AuthAPI = {

    login: async (email, password) => {

        return apiRequest(
            "/auth/login",
            {
                method: "POST",

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

    },


    register: async (userData) => {

        return apiRequest(
            "/auth/register",
            {
                method: "POST",

                body: JSON.stringify(userData)
            }
        );

    },


    me: async () => {

        return apiRequest(
            "/auth/me",
            {
                method: "GET"
            }
        );

    },


    logout: async () => {

        return apiRequest(
            "/auth/logout",
            {
                method: "POST"
            }
        );

    }

};


// =========================================================
// EXPORT TO WINDOW
// =========================================================

window.PulseCareAPI = {
    request: apiRequest,
    auth: AuthAPI
};