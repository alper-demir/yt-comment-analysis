const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const token = localStorage.getItem("token");

export const getAnalyzes = async (page, limit) => {
    try {
        const response = await fetch(`${BACKEND_URL}/analizes?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "GET"
        })

        return response;
    } catch (error) {
        console.log(error);
    }
}