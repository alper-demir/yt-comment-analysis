import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { getAnalyzes } from "../services/analizeService";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import LoadingSpinner from "../components/LoadingSpinner";

const AnalizeHistory = () => {
    const limit = 10;
    const [page, setPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(null);
    const [analyzes, setAnalyzes] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    const analizes = async () => {
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
        analizes();
    }, [page]);

    const totalPages = Math.ceil(totalRecord / limit);

    return (
        <Table>
            <TableCaption>
                {analyzes.length <= 0 ? (
                    <>There is no analysis record.</>
                ) : (
                    <>
                        A list of your video analyses.
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
                    <TableHead className="w-[100px]">Video</TableHead>
                    <TableHead>Positive</TableHead>
                    <TableHead>Negative</TableHead>
                    <TableHead>Neutral</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Token Usage</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
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
                            <TableCell>{new Date(analize.createdAt).toLocaleDateString("en-GB")}</TableCell>
                            <TableCell className="text-right">{analize.total_token}</TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>

            <TableFooter>
                <TableRow>
                    <TableCell colSpan={7}>
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

export default AnalizeHistory;
