import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router"
import { getAnalyzes } from "../services/analizeService";


const AnalizeHistory = () => {

    const limit = 10;
    const [page, setPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(null);
    const [analyzes, setAnalyzes] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();


    console.log(searchParams.get("page"));

    const analizes = async () => {
        const response = await getAnalyzes(page, limit);
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            setTotalRecord(data.count);
            setAnalyzes(data.rows);
        }
    }

    useEffect(() => {
        const currentPage = parseInt(searchParams.get("page") || "1", 10);
        setPage(currentPage);
    }, [searchParams]);

    useEffect(() => {
        analizes();
    }, [page]);

    return (
        <Table>
            <TableCaption>
                {
                    analyzes.length <= 0 ? (
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
                    )
                }

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
                {analyzes.length > 0 && analyzes.map((analize, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">
                            <Link to={`https://www.youtube.com/watch?v=${analize.videoId}`} target="_blank">
                                <img
                                    src={`https://img.youtube.com/vi/${analize.videoId}/maxresdefault.jpg`}
                                    alt="YouTube Thumbnail"
                                    className={`rounded-xl shadow-md w-full object-cover transition-opacity duration-300
                                }`}
                                /></Link>
                        </TableCell>
                        <TableCell>{analize.positive_comment_count}</TableCell>
                        <TableCell>{analize.negative_comment_count}</TableCell>
                        <TableCell>{analize.neutral_comment_count}</TableCell>
                        <TableCell>{analize.total_comment_count}</TableCell>
                        <TableCell>
                            {new Date(analize.createdAt).toLocaleDateString("en-GB")}
                        </TableCell>
                        <TableCell className="text-right">{analize.total_token}</TableCell>
                    </TableRow>
                ))}
            </TableBody>

            <TableFooter>
                <TableRow>
                    <TableCell colSpan={7}>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={`?page=${page - 1}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page > 1) {
                                                const newPage = page - 1;
                                                setSearchParams({ page: newPage });
                                            }
                                        }}
                                    />
                                </PaginationItem>

                                {Array.from({ length: Math.ceil(totalRecord / limit) }).map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href={`?page=${i + 1}`}
                                            isActive={page === i + 1}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const newPage = i + 1;
                                                setSearchParams({ page: newPage });
                                            }}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href={`?page=${page + 1}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page < Math.ceil(totalRecord / limit)) {
                                                const newPage = parseInt(page) + 1;
                                                setSearchParams({ page: newPage });
                                            }
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </TableCell>
                </TableRow>
            </TableFooter>

        </Table>
    )
}

export default AnalizeHistory