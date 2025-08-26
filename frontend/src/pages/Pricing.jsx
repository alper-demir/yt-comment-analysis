import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { getTokenPlans } from "../services/billingService";
import LoadingSpinner from "../components/LoadingSpinner";

const Pricing = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await getTokenPlans();
                const data = await res.json();
                setPlans(data);
            } catch (err) {
                console.error("Failed to load plans", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="text-center space-y-3 mb-12">
                <h1 className="text-3xl font-bold tracking-tight">Pricing Plans</h1>
                <p className="text-muted-foreground text-lg">
                    Choose the right token package for your needs. Pay only for what you use.
                </p>
            </div>

            {loading ? (
                <p className="text-center"><LoadingSpinner /></p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="flex flex-col h-full border-2 hover:shadow-lg transition rounded-2xl">
                                <CardHeader className="text-center">
                                    <CardTitle className="text-xl font-semibold">
                                        {plan.tokens.toLocaleString()} Tokens
                                    </CardTitle>
                                </CardHeader>

                                <Separator />

                                <CardContent className="flex-1 text-center py-6 space-y-4">
                                    <p className="text-3xl font-bold">
                                        {plan.price.toFixed(2)} {plan.currency}
                                    </p>
                                    {plan.description ? (
                                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Token package for flexible analysis usage.
                                        </p>
                                    )}
                                </CardContent>

                                <CardFooter className="flex justify-center">
                                    <Button size="lg" className="w-full">
                                        Buy Now
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Pricing;