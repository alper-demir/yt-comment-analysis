import { useNavigate, useLocation, Outlet } from "react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

const BillingLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const tabMap = {
        "/billing/overview": "overview",
        "/billing/history": "history",
    };

    const activeTab = tabMap[location.pathname] || "overview";

    const handleTabChange = (value) => {
        navigate(`/billing/${value}`);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{t("billing.title")}</h2>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="mb-6">
                    <TabsTrigger value="overview">{t("billing.tabs.overview")}</TabsTrigger>
                    <TabsTrigger value="history">{t("billing.tabs.history")}</TabsTrigger>
                </TabsList>
                <Outlet />
            </Tabs>
        </div>
    );
};

export default BillingLayout;