import { createBrowserRouter } from "react-router"
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import PublicRoute from "./components/PublicRoute";

const router = createBrowserRouter([
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },

    {
        path: "",
        element: <ProtectedRoute />,
        children: [
            { path: "inbox", element: <div>Inbox</div> },
            { path: "calendar", element: <div>Calendar</div> },
            { path: "settings", element: <div>Settings</div> },
        ]
    },
    {
        path: "",
        element: <PublicRoute />,
        children: [
            { path: "/", element: <Home />, index: true },
            { path: "/test", element: <div>Test</div> },
        ]
    }
]);


export default router;