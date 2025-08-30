import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

const PaymentResult = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const status = searchParams.get("status"); // SUCCESS / FAIL / PENDING
    const planId = searchParams.get("planId");

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    const getStatusColor = () => {
        switch (status) {
            case "SUCCESS":
                return "bg-green-500";
            case "FAIL":
                return "bg-red-500";
            case "PENDING":
                return "bg-yellow-500";
            default:
                return "bg-gray-400";
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-[400px] text-center">
                <CardHeader>
                    <CardTitle>
                        {t("paymentResult.title", { status })}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                        {t("paymentResult.description", { planId })}
                    </p>
                    <Badge className={`${getStatusColor()} text-white px-4 py-2 rounded-full`}>
                        {t(`paymentResult.status.${status?.toLowerCase() || "unknown"}`)}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                        {t("paymentResult.redirecting")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {t("paymentResult.manualRedirect")}{" "}
                        <button
                            className="text-blue-600 underline"
                            onClick={() => navigate("/")}
                        >
                            {t("paymentResult.here")}
                        </button>{" "}
                        {t("paymentResult.toHomepage")}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentResult;