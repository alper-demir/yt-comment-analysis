import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPurchaseHistory } from '@/services/billingService';
import toast from "react-hot-toast";
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";

const BillingHistory = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPurchases = async () => {
        setLoading(true);
        const res = await getPurchaseHistory();
        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message);
            setLoading(false);
            return;
        }

        setPurchases(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    if (loading) { // Loading skeleton
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-[70px]" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    if (purchases.length === 0) return <p>No purchases yet.</p>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                        <TableCell>{new Date(purchase.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{purchase.amount}</TableCell>
                        <TableCell>{`${purchase.price}${purchase.currency}`}</TableCell>
                        <TableCell>
                            <Button variant="outline">View</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default BillingHistory;