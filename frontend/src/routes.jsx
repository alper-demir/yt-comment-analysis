import { createBrowserRouter } from "react-router"
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import PublicRoute from "./components/PublicRoute";
import VerifyAccount from "./pages/VerifyAccount";
import AnalizeHistory from "./pages/AnalizeHistory";
import Settings from "./pages/Settings";
import BaseLayout from "./layouts/BaseLayout";
import Features from "./pages/Features";
import ErrorPage from "./pages/ErrorPage";
import Contact from "./pages/Contact";

const router = createBrowserRouter([
    {
        path: "",
        element: <BaseLayout />,
        errorElement: <ErrorPage />,
        children: [
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "/verify-account/:token", element: <VerifyAccount /> },
            {
                path: "",
                element: <ProtectedRoute />,
                children: [
                    { path: "inbox", element: <div>Inbox</div> },
                    { path: "calendar", element: <div>Calendar</div> },
                    { path: "settings", element: <Settings /> },
                    { path: "history", element: <AnalizeHistory /> },
                ]
            },
            {
                path: "",
                element: <PublicRoute />,
                children: [
                    { path: "/", element: <Home />, index: true },
                    { path: "/test", element: <div>Test</div> },
                    { path: "/features", element: <Features /> },
                    { path: "/contact", element: <Contact /> },
                ]
            }
        ]
    }
]);


export default router;