import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Toaster, toast } from "react-hot-toast";
import LoadingSpinner from './../components/LoadingSpinner';

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

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
      toast.error("Please provide a valid YouTube video link", {
        position: "top-right",
      });
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
      toast.success("Analize completed!", {
        position: "top-right",
      });
    } catch (err) {
      setError(err.message);
      toast.error(err.message, {
        position: "top-right",
      });
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
    <div className="flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          YouTube Comment Analysis
        </h1>
        <p className="text-center text-gray-600">
          Provide a YouTube video link and we'll analyze the comments!
        </p>

        {/* Input ve Buton */}
        <div className="space-y-2">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Video Link
          </label>
          <div className="flex gap-2">
            <input
              id="url"
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setIsValidUrl(true);
                setError(null);
              }}
              className={`flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isValidUrl ? "border-gray-300" : "border-red-500"
                }`}
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition"
            >
              {isLoading ? "Analyzing..." : "Analize"}
            </button>
          </div>
          {!isValidUrl && (
            <p className="text-sm text-red-500">Enter a valid YouTube link.</p>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-center text-red-500 font-medium">{error}</p>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <LoadingSpinner size="md" />
        )}

        {/* Analize Results */}
        {analysis && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Analysis Results
            </h2>

            {/* Toplam yorum sayısı */}
            <p className="text-gray-600">
              Total Comments Analyzed:{" "}
              <span className="font-semibold">{totalComments}</span>
            </p>

            {/* Pie Chart */}
            <div className="max-w-xs mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
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

            {/* Sayılar + yüzdeler */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-100 rounded-md text-center">
                <p className="font-medium text-blue-800">Positive</p>
                <p className="text-2xl font-bold">{analysis.positive || 0}</p>
                <p className="text-sm text-blue-700">{percentages.positive}%</p>
              </div>
              <div className="p-4 bg-red-100 rounded-md text-center">
                <p className="font-medium text-red-800">Negative</p>
                <p className="text-2xl font-bold">{analysis.negative || 0}</p>
                <p className="text-sm text-red-700">{percentages.negative}%</p>
              </div>
              <div className="p-4 bg-yellow-100 rounded-md text-center">
                <p className="font-medium text-yellow-800">Neutral</p>
                <p className="text-2xl font-bold">{analysis.neutral || 0}</p>
                <p className="text-sm text-yellow-700">{percentages.neutral}%</p>
              </div>
            </div>

            {/* Özetler */}
            <div className="space-y-2">
              <p className="font-medium text-gray-700">Liked Summary:</p>
              <p className="text-gray-600">
                {analysis.liked_summary || "No Data"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-gray-700">Disliked Summary:</p>
              <p className="text-gray-600">
                {analysis.disliked_summary || "No Data"}
              </p>
            </div>
          </div>
        )}

      </div>
      <Toaster />
    </div>
  );

}

export default Home