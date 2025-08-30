import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { getAnalyzes } from "@/services/analizeService";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from '@/components/ui/button';
import { formatDate } from "@/utils/dateUtils";
import { formatDateTimeTooltip } from "@/utils/dateUtils";
import { useTranslation } from "react-i18next";

const AnalizeHistory = () => {
    const { t } = useTranslation();
    const limit = 10;
    const [page, setPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(null);
    const [analyzes, setAnalyzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const fetchAnalyses = async () => {
        setLoading(true);
        try {
            const response = await getAnalyzes(page, limit);
            const data = await response.json();
            if (response.ok) {
                setTotalRecord(data.count);
                setAnalyzes(data.rows);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const currentPage = parseInt(searchParams.get("page") || "1", 10);
        setPage(currentPage);
    }, [searchParams]);

    useEffect(() => {
        fetchAnalyses();
    }, [page]);

    const totalPages = Math.ceil(totalRecord / limit);

    return (
        <Table>
            <TableCaption>
                {analyzes.length <= 0 ? (
                    t("analysisHistory.noRecords")
                ) : (
                    <>
                        {t("analysisHistory.caption")}
                        {totalRecord && (
                            <>
                                {" "}
                                {t("analysisHistory.showing")} {((page - 1) * limit) + 1}-{Math.min(page * limit, totalRecord)} {t("analysisHistory.of")} {totalRecord}
                            </>
                        )}
                    </>
                )}
            </TableCaption>

            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">{t("analysisHistory.video")}</TableHead>
                    <TableHead>{t("analysisHistory.positive")}</TableHead>
                    <TableHead>{t("analysisHistory.negative")}</TableHead>
                    <TableHead>{t("analysisHistory.neutral")}</TableHead>
                    <TableHead>{t("analysisHistory.total")}</TableHead>
                    <TableHead>{t("analysisHistory.date")}</TableHead>
                    <TableHead>{t("analysisHistory.tokenUsage")}</TableHead>
                    <TableHead className="text-right"></TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center py-10">
                            <LoadingSpinner />
                        </TableCell>
                    </TableRow>
                ) : (
                    analyzes.length > 0 &&
                    analyzes.map((analize, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">
                                <Link to={`https://www.youtube.com/watch?v=${analize.videoId}`} target="_blank">
                                    <img
                                        src={`https://img.youtube.com/vi/${analize.videoId}/maxresdefault.jpg`}
                                        alt="YouTube Thumbnail"
                                        className="rounded-xl shadow-md w-full object-cover transition-opacity duration-300"
                                    />
                                </Link>
                            </TableCell>
                            <TableCell>{analize.positive_comment_count}</TableCell>
                            <TableCell>{analize.negative_comment_count}</TableCell>
                            <TableCell>{analize.neutral_comment_count}</TableCell>
                            <TableCell>{analize.total_comment_count}</TableCell>
                            <TableCell>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span>{formatDate(analize.createdAt)}</span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {formatDateTimeTooltip(analize.createdAt)}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                            <TableCell>{analize.total_token}</TableCell>
                            <TableCell className="text-right">
                                <Link to={`/analysis/${analize.id}`}>
                                    <Button variant="outline">{t("analysisHistory.view")}</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))
                )}
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
                                        onClick={(e) => { e.preventDefault(); if (page > 1) setSearchParams({ page: page - 1 }); }}
                                    >{t("analysisHistory.pagination.previous")}</PaginationPrevious>
                                </PaginationItem>

                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href={`?page=${i + 1}`}
                                            isActive={page === i + 1}
                                            onClick={(e) => { e.preventDefault(); setSearchParams({ page: i + 1 }); }}
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
                                        onClick={(e) => { e.preventDefault(); if (page < totalPages) setSearchParams({ page: page + 1 }); }}
                                    >{t("analysisHistory.pagination.next")}</PaginationNext>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
};

export default AnalizeHistory;