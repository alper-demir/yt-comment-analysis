import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Toaster, toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "@/components/LoadingSpinner";

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const YOUTUBE_ID_LENGTH = 11;
  const token = localStorage.getItem("token");

  // Extract video ID
  const extractVideoId = (url) => {
    if (url.includes("youtube.com/shorts/")) { // Youtube shorts
      const videoId = url.split("shorts/")[1]?.slice(0, YOUTUBE_ID_LENGTH);
      return videoId?.length === YOUTUBE_ID_LENGTH ? videoId : null;
    }
    if (!url.includes("youtube.com/watch?v=")) return null;
    const videoId = url.split("watch?v=")[1]?.slice(0, YOUTUBE_ID_LENGTH);
    return videoId?.length === YOUTUBE_ID_LENGTH ? videoId : null;
  };

  const handleSubmit = async () => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      setIsValidUrl(false);
      setError("Please provide a valid YouTube video link");
      toast.error("Please provide a valid YouTube video link");
      return;
    }

    setIsValidUrl(true);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch(`http://localhost:3000/api/v1/yt-video/${videoId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) throw new Error(data.message);

      setAnalysis(data);
      toast.success("Analize completed!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const totalComments =
    (analysis?.positive || 0) +
    (analysis?.negative || 0) +
    (analysis?.neutral || 0);

  const percentages = totalComments
    ? {
      positive: ((analysis.positive || 0) / totalComments * 100).toFixed(1),
      negative: ((analysis.negative || 0) / totalComments * 100).toFixed(1),
      neutral: ((analysis.neutral || 0) / totalComments * 100).toFixed(1),
    }
    : { positive: 0, negative: 0, neutral: 0 };

  const chartData = analysis
    ? {
      labels: ["Positive", "Negative", "Neutral"],
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
    <div className="flex items-center justify-center p-6">
      <Card className="w-full max-w-3xl shadow-lg border">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">
            YouTube Comment Analysis
          </CardTitle>
          <CardDescription className="text-center">
            Provide a YouTube video link and we'll analyze the comments!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Input Alanı */}
          <div className="space-y-2">
            <Label htmlFor="url">Video Link</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setIsValidUrl(true);
                  setError(null);
                }}
                className={isValidUrl ? "" : "border-red-500 focus-visible:ring-red-500"}
              />
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="min-w-[120px] cursor-pointer"
              >
                {isLoading ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
            {!isValidUrl && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          {/* Loading */}
          {isLoading && <LoadingSpinner size="md" />}

          {/* Thumbnail */}
          {url && (() => {
            const videoId = extractVideoId(url);
            if (!videoId) return null;

            return (
              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="relative w-full max-w-lg flex justify-center items-center">
                  {isImageLoading && (
                    <div className="absolute">
                      <LoadingSpinner size="md" />
                    </div>
                  )}
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt="YouTube Thumbnail"
                    className={`rounded-xl shadow-md w-full object-cover transition-opacity duration-300 ${isImageLoading ? "opacity-0" : "opacity-100"
                      }`}
                    onLoad={() => setIsImageLoading(false)}
                  />
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-blue-600 transition"
                >
                  {url}
                </a>
              </div>
            );
          })()}

          {/* Results */}
          {analysis && (
            <div className="space-y-6">
              <Separator />
              <h2 className="text-xl font-semibold">Analysis Results</h2>

              {/* Toplam yorum */}
              <p>
                Total Comments Analyzed:{" "}
                <span className="font-semibold">{totalComments}</span>
              </p>

              {/* Pie Chart */}
              <div className="max-w-xs mx-auto">
                <h3 className="text-lg font-semibold mb-2">
                  Sentiment Distribution
                </h3>
                {chartData && (
                  <Pie
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "top" },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const label = context.label || "";
                              const value = context.parsed || 0;
                              const percent = ((value / totalComments) * 100).toFixed(1);
                              return `${label}: ${value} (${percent}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="text-center p-4">
                  <p className="font-medium">Positive</p>
                  <p className="text-2xl font-bold">{analysis.positive || 0}</p>
                  <p className="text-sm">{percentages.positive}%</p>
                </Card>

                <Card className="text-center p-4">
                  <p className="font-medium">Negative</p>
                  <p className="text-2xl font-bold">{analysis.negative || 0}</p>
                  <p className="text-sm">{percentages.negative}%</p>
                </Card>

                <Card className="text-center p-4">
                  <p className="font-medium">Neutral</p>
                  <p className="text-2xl font-bold">{analysis.neutral || 0}</p>
                  <p className="text-sm">{percentages.neutral}%</p>
                </Card>
              </div>

              {/* Summaries */}
              <div className="space-y-2">
                <p className="font-medium">Liked Summary:</p>
                <p>
                  {analysis.liked_summary || "No Data"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Disliked Summary:</p>
                <p>
                  {analysis.disliked_summary || "No Data"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

}

export default Home