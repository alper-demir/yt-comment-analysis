import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter, TableCaption } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getPaymentHistory } from '@/services/paymentService';
import toast from "react-hot-toast";
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "react-router";
import { formatDate, formatDateTimeTooltip } from "@/utils/dateUtils";
import { useTranslation } from "react-i18next";

const PaymentHistory = () => {
    const { t } = useTranslation();
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
            if (!res.ok) return toast.error(data.message);
            setTotalRecord(data.count);
            setPayments(data.rows);
        } catch (err) {
            console.error(err);
            toast.error(t("billing.history.fetchError"));
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
                        <TableHead>{t("billing.history.date")}</TableHead>
                        <TableHead>{t("billing.history.plan")}</TableHead>
                        <TableHead>{t("billing.history.token")}</TableHead>
                        <TableHead>{t("billing.history.price")}</TableHead>
                        <TableHead>{t("billing.history.status")}</TableHead>
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

    if (payments.length === 0) return <p>{t("billing.history.noPayments")}</p>;

    return (
        <Table>
            <TableCaption>
                {payments.length <= 0 ? t("billing.history.noPayments") : (
                    <>
                        {t("billing.history.list")}
                        {totalRecord && t("billing.history.shown", {
                            from: (page - 1) * limit + 1,
                            to: Math.min(page * limit, totalRecord),
                            total: totalRecord
                        })}
                    </>
                )}
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>{t("billing.history.date")}</TableHead>
                    <TableHead>{t("billing.history.plan")}</TableHead>
                    <TableHead>{t("billing.history.token")}</TableHead>
                    <TableHead>{t("billing.history.price")}</TableHead>
                    <TableHead>{t("billing.history.status")}</TableHead>
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
                                        <span>{formatDate(payment.createdAt)}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {formatDateTimeTooltip(payment.createdAt)}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </TableCell>
                        <TableCell>{payment.TokenPlan?.name || payment.planId}</TableCell>
                        <TableCell>{payment.amount}</TableCell>
                        <TableCell>{`${payment.price} ${payment.currency}`}</TableCell>
                        <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${payment.status === "SUCCESS" ? "bg-green-100 text-green-800" : payment.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                                {t(`billing.history.statuses.${payment.status.toLowerCase()}`)}
                            </span>
                        </TableCell>
                        <TableCell>
                            <Button variant="outline" size="sm">{t("billing.history.view")}</Button>
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
                                    >
                                        {t("billing.pagination.previous")}
                                    </PaginationPrevious>
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
                                    >{t("billing.pagination.next")}
                                    </PaginationNext>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table >
    );
};

export default PaymentHistory;