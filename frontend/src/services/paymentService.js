const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const createCheckoutSession = async (data) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BACKEND_URL}/payment/create-checkout-session`, {
            body: JSON.stringify(data),
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const getPaymentHistory = async (page, limit) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BACKEND_URL}/payment-history?page=${page}&limit=${limit}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            method: "GET"
        });
        return response;
    } catch (err) {
        console.error("Purchase history fetch error:", err);
    }
}