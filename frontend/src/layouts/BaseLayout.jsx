import { useLayoutEffect } from 'react'
import { Outlet } from 'react-router'

const BaseLayout = () => {

    const theme = localStorage.getItem("theme");

    useLayoutEffect(() => {
        const root = document.documentElement;

        if (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            localStorage.setItem("theme", "system");
        }

        if (theme === "light") {
            root.classList.remove("dark");
        } else if (theme === "dark") {
            root.classList.add("dark");
        } else if (theme === "system") {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }
        }
    }, [theme]);

    return (
        <Outlet />
    )
}

export default BaseLayout