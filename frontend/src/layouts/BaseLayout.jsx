import { useLayoutEffect } from 'react';
import { Outlet } from 'react-router';
import { useSelector } from 'react-redux';

const BaseLayout = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user);

    useLayoutEffect(() => {
        const root = document.documentElement;
        let finalTheme = null;

        // If the user is logged in and the theme exists in the database, use it
        if (isAuthenticated && user?.UserPreference?.theme) {
            finalTheme = user.UserPreference.theme;
            localStorage.setItem("theme", finalTheme);
        }
        else if (localStorage.getItem("theme")) {
            finalTheme = localStorage.getItem("theme");
        }
        // If none, decide according to the system
        else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            finalTheme = "system";
            localStorage.setItem("theme", "system");
            if (prefersDark) {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }
            return;
        }

        if (finalTheme === "light") {
            root.classList.remove("dark");
        } else if (finalTheme === "dark") {
            root.classList.add("dark");
        } else if (finalTheme === "system") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (prefersDark) {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }
        }
    }, [isAuthenticated, user]);

    return <Outlet />;
};

export default BaseLayout;
