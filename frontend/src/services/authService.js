import { clearUser } from '../redux/user';
import { store } from './../store';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const token = localStorage.getItem("token");

export const login = async (email, password) => {
    try {
        const response = await fetch(`${BACKEND_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        return response;
    } catch (error) {
        console.log(error);
    }
}

export const register = async (email, password) => {
    try {
        const response = await fetch(`${BACKEND_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        return response;
    } catch (error) {
        console.log(error);
    }
}

export const authNverification = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}/verify-token`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.log(error);
    }
};

export const verifyAccount = async (userId) => {
    try {
        const response = await fetch(`${BACKEND_URL}/verify-account/${userId}`, {
            method: "GET"
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const logout = async () => {
    store.dispatch(clearUser());
    localStorage.removeItem("token");
    window.location.href = "/login";
}