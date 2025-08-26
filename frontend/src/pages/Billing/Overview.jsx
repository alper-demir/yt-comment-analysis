import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRemainingTokens } from "@/services/billingService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Skeleton } from '@/components/ui/skeleton';
import { getTokenPlans } from "@/services/billingService";
import { useNavigate } from "react-router";

const Overview = () => {

    const user = useSelector(state => state.user.user)
    const navigate = useNavigate();
    const [remainingTokens, setRemainingTokens] = useState(0);
    const [loading, setLoading] = useState(true);
    const [tokenPlans, setTokenPlans] = useState([]);

    const fetchPlans = async () => {
        const res = await getTokenPlans();
        const data = await res.json();
        if (!res.ok) {
            toast.error(data.message);
            return;
        }
        console.log(data)
        setTokenPlans(data);
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchToken = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const res = await getRemainingTokens(user.id);
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message);
                return;
            }
            setRemainingTokens(data.remainingTokens);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchToken();
    }, [user]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Remaining Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <Skeleton className="h-6 w-32 rounded-md" />
                    ) : (
                        <p className="text-2xl font-bold">{remainingTokens} Tokens</p>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tokenPlans.map((plan) => (
                    <Card key={plan.id}>
                        <CardHeader>
                            <CardTitle>{plan.tokens} Tokens</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Price: {plan.price + plan.currency}</p>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => navigate(`/checkout?plan=${plan.id}`)}>Buy</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Overview;