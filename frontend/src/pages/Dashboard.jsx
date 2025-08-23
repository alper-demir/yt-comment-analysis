import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter, TableCaption, } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getDashboardSummary } from "../services/analizeService";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { Link } from 'react-router';
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import { HelpCircle } from "lucide-react"
import { Button } from '@/components/ui/button';

const DashboardPage = () => {

    const LAST_ANALYSES_COUNT = 5;

    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            try {
                const res = await getDashboardSummary();
                const data = await res.json();
                console.log(data)
                if (!res.ok) {
                    toast.error(data.message || "Failed to fetch dashboard data");
                    return;
                }
                setSummary(data);
            } catch (err) {
                console.error(err);
                toast.error("Something went wrong while fetching dashboard data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (isLoading) return <LoadingSpinner size="lg" />;

    if (!summary)
        return <p className="text-center mt-10">No dashboard data available.</p>;

    const { totalAnalyses, totalComments, totalTokens, sentiment, lastAnalyzes, remainingTokens } =
        summary;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="shadow-lg">
                    <CardHeader className="flex items-center">
                        <CardTitle>Total Analyses</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center">
                                    <p>Toplam yapılan analiz sayısını ifade eder.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{totalAnalyses}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader className="flex items-center">
                        <CardTitle>Total Comments</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center">
                                    <p>Tüm analizlerde işlenen toplam yorum sayısını ifade eder.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{totalComments}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader className="flex items-center">
                        <CardTitle>Token Usage</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center">
                                    <p>
                                        Toplam kullanılan token sayısı. Her yorum analizi için API’de harcanan toplam işlem birimini ifade eder.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{totalTokens}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card className="shadow-lg">
                    <CardHeader className="flex items-center">
                        <CardTitle>Remaining Tokens</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center">
                                    <p>Kullanıcının bakiyesinde kalan token miktarını gösterir.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <p className="text-2xl font-bold">{remainingTokens}</p>
                            <Button>Buy tokens</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Last Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            {lastAnalyzes[0]?.createdAt
                                ? new Date(lastAnalyzes[0].createdAt).toLocaleDateString()
                                : "-"}
                        </p>
                    </CardContent>
                </Card>
            </div>


            {/* Sentiment Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="shadow-md bg-green-50 dark:bg-green-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" /> Positive
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-bold">{sentiment.positive}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-md bg-red-50 dark:bg-red-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500" /> Negative
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-bold">{sentiment.negative}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-md bg-yellow-50 dark:bg-yellow-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="w-5 h-5 text-yellow-500" /> Neutral
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-bold">{sentiment.neutral}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Last Analyses Table */}
            <Card className="shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle>Last Analyses</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>Last {LAST_ANALYSES_COUNT} analysis.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Video</TableHead>
                                <TableHead>Positive</TableHead>
                                <TableHead>Negative</TableHead>
                                <TableHead>Neutral</TableHead>
                                <TableHead>Total Comments</TableHead>
                                <TableHead>Total Tokens</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lastAnalyzes.map((a) => (
                                <TableRow key={a.id}>
                                    <TableCell>
                                        <Link
                                            to={`/analysis/${a.id}`}
                                            className="text-indigo-600 hover:underline"
                                        >
                                            See Detail
                                        </Link>
                                    </TableCell>
                                    <TableCell>{a.positive_comment_count}</TableCell>
                                    <TableCell>{a.negative_comment_count}</TableCell>
                                    <TableCell>{a.neutral_comment_count}</TableCell>
                                    <TableCell>{a.total_comment_count}</TableCell>
                                    <TableCell>{a.total_token}</TableCell>
                                    <TableCell>
                                        {new Date(a.createdAt).toLocaleDateString("en-GB")}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );

};

export default DashboardPage;
