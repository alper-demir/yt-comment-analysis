const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const getAnalyzes = async (page, limit) => {
    const token = localStorage.getItem("token");
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

export const getOneAnalyze = async (id) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BACKEND_URL}/analize/${id}`, {
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

export const getDashboardSummary = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BACKEND_URL}/dashboard-summary`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "GET",
        });

        return response;
    } catch (error) {
        console.log(error);
    }
};
