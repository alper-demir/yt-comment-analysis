import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Tooltip as ShadcnuiToolTip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend);

const AnalizeResult = ({ analysis, videoId = null }) => {
    const { t } = useTranslation();
    const [isImageLoading, setIsImageLoading] = useState(true);

    const totalComments = Number(analysis?.commentCount || 0);

    const percentages = totalComments
        ? {
            positive: ((analysis.positive || 0) / totalComments * 100).toFixed(2),
            negative: ((analysis.negative || 0) / totalComments * 100).toFixed(2),
            neutral: ((analysis.neutral || 0) / totalComments * 100).toFixed(2),
        }
        : { positive: 0, negative: 0, neutral: 0 };

    const chartData = analysis
        ? {
            labels: [t("analysis.positive"), t("analysis.negative"), t("analysis.neutral")],
            datasets: [
                {
                    data: [
                        analysis.positive || 0,
                        analysis.negative || 0,
                        analysis.neutral || 0,
                    ],
                    backgroundColor: ["#3B82F6", "#EF4444", "#F59E0B"],
                    hoverOffset: 10,
                },
            ],
        }
        : null;

    return (
        <div className="space-y-6 max-w-3xl mx-auto p-4">
            <div className="mt-6 flex flex-col items-center gap-3">
                <div className="relative w-full max-w-lg flex justify-center items-center">
                    {isImageLoading && <div className="absolute"><LoadingSpinner size="md" /></div>}
                    <img
                        src={`https://img.youtube.com/vi/${analysis.videoId || videoId}/maxresdefault.jpg`}
                        alt="YouTube Thumbnail"
                        className={`rounded-xl shadow-md w-full object-cover transition-opacity duration-300 ${isImageLoading ? "opacity-0" : "opacity-100"}`}
                        onLoad={() => setIsImageLoading(false)}
                    />
                </div>
                <a
                    href={`https://www.youtube.com/watch?v=${analysis.videoId || videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-blue-600 transition"
                >
                    {`https://www.youtube.com/watch?v=${analysis.videoId || videoId}`}
                </a>
            </div>
            <Separator />

            <h2 className="text-xl font-semibold flex items-center gap-2">
                {t("analysis.results")}
                {analysis.trialAccessAnalysis && (
                    <TooltipProvider>
                        <ShadcnuiToolTip>
                            <TooltipTrigger asChild>
                                <Badge variant="secondary" className="bg-teal-500 text-white dark:bg-teal-600 cursor-pointer">
                                    {t("analysis.trialAccess")} <HelpCircle />
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center" className="max-w-xs">
                                <p>{t("analysis.trialAccessTooltip")}</p>
                            </TooltipContent>
                        </ShadcnuiToolTip>
                    </TooltipProvider>
                )}
            </h2>

            <div className="max-w-xs mx-auto">
                <h3 className="text-lg font-semibold mb-2">{t("analysis.sentimentDistribution")}</h3>
                {chartData && <Pie data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" }, tooltip: { callbacks: { label: (ctx) => { const label = ctx.label || ""; const value = ctx.parsed || 0; const percent = ((value / totalComments) * 100).toFixed(1); return `${label}: ${value} (${percent}%)`; } } } } }} />}
            </div>

            
            <p className="text-sm text-muted-foreground text-center">
                {t("analysis.totalComments", { count: analysis.commentCount })}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="text-center p-4">
                    <p className="font-medium">{t("analysis.positive")}</p>
                    <p className="text-2xl font-bold">{analysis.positive || 0}</p>
                    <p className="text-sm">{percentages.positive}%</p>
                </Card>
                <Card className="text-center p-4">
                    <p className="font-medium">{t("analysis.negative")}</p>
                    <p className="text-2xl font-bold">{analysis.negative || 0}</p>
                    <p className="text-sm">{percentages.negative}%</p>
                </Card>
                <Card className="text-center p-4">
                    <p className="font-medium">{t("analysis.neutral")}</p>
                    <p className="text-2xl font-bold">{analysis.neutral || 0}</p>
                    <p className="text-sm">{percentages.neutral}%</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="text-center p-4">
                    <p className="font-medium">{t("analysis.inputTokens")}</p>
                    <p className="text-2xl font-bold">{analysis.inputTokens || 0}</p>
                </Card>
                <Card className="text-center p-4">
                    <p className="font-medium">{t("analysis.outputTokens")}</p>
                    <p className="text-2xl font-bold">{analysis.outputTokens || 0}</p>
                </Card>
                <Card className="text-center p-4">
                    <p className="font-medium">{t("analysis.totalTokens")}</p>
                    <p className="text-2xl font-bold">{analysis.totalTokens || 0}</p>
                </Card>
            </div>
            <Separator />
            <div className="space-y-2">
                <p className="font-medium">{t("analysis.likedSummary")}</p>
                <p>{analysis.liked_summary || t("analysis.noData")}</p>
            </div>
            <Separator />
            <div className="space-y-2">
                <p className="font-medium">{t("analysis.dislikedSummary")}</p>
                <p>{analysis.disliked_summary || t("analysis.noData")}</p>
            </div>
            <Separator />
            <div className="space-y-2">
                <p className="font-medium">{t("analysis.neutralSummary")}</p>
                <p>{analysis.neutral_summary || t("analysis.noData")}</p>
            </div>
        </div>
    )
}

export default AnalizeResult;