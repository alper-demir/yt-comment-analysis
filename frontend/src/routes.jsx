import { createBrowserRouter, Navigate } from "react-router"
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
import Dashboard from "./pages/Dashboard";
import AnalysisDetail from './pages/AnalysisDetail';
import BillingLayout from "./layouts/BillingLayout";
import BillingHistory from "./pages/Billing/BillingHistory";
import Overview from "./pages/Billing/Overview";

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
                    { path: "/dashboard", element: <Dashboard /> },
                    { path: "/analysis/:id", element: <AnalysisDetail /> },
                    {
                        path: "/billing",
                        element: <BillingLayout />,
                        children: [
                            { index: true, element: <Navigate to="overview" replace /> }, // /billing → /billing/overview
                            { path: "overview", element: <Overview /> },
                            { path: "history", element: <BillingHistory /> },
                        ],
                    }
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