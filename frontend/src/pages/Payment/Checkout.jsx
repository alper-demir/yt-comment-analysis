import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getTokenPlans } from "@/services/billingService";
import { createCheckoutSession } from "@/services/paymentService";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Checkout = () => {

    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const planId = searchParams.get("plan");
        if (planId && plans.length > 0) {
            const planObj = plans.find((p) => p.id === planId);
            if (planObj) setSelectedPlan(planObj);
        }
    }, [searchParams, plans]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await getTokenPlans();
                const data = await res.json();
                if (!res.ok) {
                    toast.error(data.message);
                    return;
                }
                setPlans(data);
            } catch (err) {
                console.error(err);
                toast.error(t("checkout.errors.loadPlans"));
            }
        };
        fetchPlans();
    }, []);

    const handleProceed = async () => {
        if (!selectedPlan) {
            toast.error(t("checkout.errors.noPlan"));
            return;
        }
        setLoading(true);
        try {
            const res = await createCheckoutSession({ planId: selectedPlan.id });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message);
                return;
            }
            // redirect iyzico paymentPageUrl
            // window.location.href = data.paymentPageUrl;
            window.open(data.paymentPageUrl, "_blank"); // new tab

        } catch (err) {
            console.error(err);
            toast.error(t("checkout.errors.checkoutFailed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
            <h1 className="text-3xl font-bold text-center">{t("checkout.title")}</h1>
            <p className="text-muted-foreground text-center">
                {t("checkout.subtitle")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <Card
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`relative cursor-pointer transition-all duration-200 border-2 rounded-2xl ${selectedPlan?.id === plan.id
                                ? "border-primary shadow-lg"
                                : "border-muted hover:shadow-md hover:scale-[1.02]"
                            }`}
                    >
                        <div
                            className={`absolute top-3 left-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPlan?.id === plan.id ? "border-primary" : ""
                                }`}
                        >
                            {selectedPlan?.id === plan.id && (
                                <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                        </div>

                        <CardHeader className="text-center">
                            <CardTitle>
                                {plan.tokens.toLocaleString()} {t("checkout.tokens")}
                            </CardTitle>
                        </CardHeader>
                        <Separator />
                        <CardContent className="text-center py-4">
                            <p className="text-lg font-semibold">
                                {plan.price.toFixed(2)} {plan.currency}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                {plan.description || t("checkout.defaultDescription")}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {selectedPlan && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="text-xl">
                            {t("checkout.selectedPlan")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                        <div>
                            <p className="font-bold">
                                {selectedPlan.tokens.toLocaleString()} {t("checkout.tokens")}
                            </p>
                            <p className="text-muted-foreground text-sm">
                                {selectedPlan.price.toFixed(2)} {selectedPlan.currency}
                            </p>
                        </div>
                        <Button size="lg" onClick={handleProceed} disabled={loading}>
                            {loading
                                ? t("checkout.redirecting")
                                : t("checkout.proceed")}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Checkout;