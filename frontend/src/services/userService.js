const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const updateUserPreference = async (data, userId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BACKEND_URL}/preferences/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(data)
        })

        return response;
    } catch (error) {
        console.log(error);
    }
}