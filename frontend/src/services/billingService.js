const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const getRemainingTokens = async (userId) => {
    const jwtToken = localStorage.getItem("token");
    try {
        const response = await fetch(`${BACKEND_URL}/remaining-tokens/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`
            },
            method: "GET"
        });
        return response;
    } catch (error) {
        console.error("Remaining tokens fetch error:", error);
    }
}

export const getTokenPlans = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BACKEND_URL}/token-plans`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });
        return response;
    } catch (error) {
        console.error("Get token plans error:", error);
    }
};