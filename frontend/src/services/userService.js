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

export const getUserInfo = async (userId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BACKEND_URL}/account/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: "GET",
        })
        return response;
    } catch (error) {
        console.log(error);
    }

}

export const updateUserInfo = async (data, userId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BACKEND_URL}/account/${userId}`, {
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

export const changePassword = async (data, userId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BACKEND_URL}/account/change-password/${userId}`, {
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