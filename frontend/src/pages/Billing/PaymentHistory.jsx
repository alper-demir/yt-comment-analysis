import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter, TableCaption } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getPaymentHistory } from '@/services/paymentService';
import toast from "react-hot-toast";
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "react-router";

const PaymentHistory = () => {

    const limit = 10;
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await getPaymentHistory(page, limit);
            const data = await res.json();
            console.log(data)
            if (!res.ok) {
                toast.error(data.message);
                setLoading(false);
                return;
            }
            setTotalRecord(data.count);
            setPayments(data.rows);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch payment history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const currentPage = parseInt(searchParams.get("page") || "1", 10);
        setPage(currentPage);
    }, [searchParams]);

    useEffect(() => {
        fetchPayments();
    }, [page]);

    const totalPages = Math.ceil(totalRecord / limit);

    if (loading) {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    if (payments.length === 0) return <p>No payments yet.</p>;

    return (
        <Table>
            <TableCaption>
                {payments.length <= 0 ? (
                    <>There is no payment record.</>
                ) : (
                    <>
                        A list of your payments.
                        {totalRecord && (
                            <>
                                {" Shown "}
                                {((page - 1) * limit) + 1}-{Math.min(page * limit, totalRecord)} of {totalRecord}
                            </>
                        )}
                    </>
                )}
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {payments.map((payment) => (
                    <TableRow key={payment.id}>
                        <TableCell>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {new Date(payment.createdAt).toLocaleString()}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </TableCell>
                        <TableCell>{payment.TokenPlan.name ? `${payment.TokenPlan.name}` : payment.planId}</TableCell>
                        <TableCell>{payment.amount}</TableCell>
                        <TableCell>{`${payment.price} ${payment.currency}`}</TableCell>
                        <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${payment.status === "SUCCESS"
                                ? "bg-green-100 text-green-800"
                                : payment.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                {payment.status}
                            </span>
                        </TableCell>
                        <TableCell>
                            <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

            <TableFooter>
                <TableRow>
                    <TableCell colSpan={8}>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={`?page=${page - 1}`}
                                        aria-disabled={page <= 1}
                                        className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page > 1) setSearchParams({ page: page - 1 });
                                        }}
                                    />
                                </PaginationItem>

                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href={`?page=${i + 1}`}
                                            isActive={page === i + 1}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSearchParams({ page: i + 1 });
                                            }}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href={`?page=${page + 1}`}
                                        aria-disabled={page >= totalPages}
                                        className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page < totalPages) setSearchParams({ page: page + 1 });
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
};

export default PaymentHistory;