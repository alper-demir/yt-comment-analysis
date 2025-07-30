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
            { path: "", index: true, element: <Home /> }
        ]
    },
    {
        path: "",
        element: <PublicRoute />,
        children: [
            { path: "/test", element: <div>test</div> }
        ]
    }
])

export default router;