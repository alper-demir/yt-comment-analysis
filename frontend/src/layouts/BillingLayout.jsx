import { useNavigate, useLocation, Outlet } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BillingLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // route -> tab mapping
    const tabMap = {
        "/billing/overview": "overview",
        "/billing/history": "history",
        // "/billing/plans": "plans",
        // "/billing/payment-methods": "payment-methods",
    };

    const activeTab = tabMap[location.pathname] || "overview";

    const handleTabChange = (value) => {
        navigate(`/billing/${value}`);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Billing</h2>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="history">Purchase History</TabsTrigger>
                    {/* <TabsTrigger value="plans">Plans</TabsTrigger>
                    <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger> */}
                </TabsList>
                <Outlet />
            </Tabs>
        </div>
    );
};

export default BillingLayout;
