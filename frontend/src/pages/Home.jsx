import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Toaster, toast } from "react-hot-toast";

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const YOUTUBE_ID_LENGTH = 11;
  const token = localStorage.getItem("token");

  // Sahte veri (API çalışana kadar test için)
  const mockAnalysis = {
    positive: 20,
    negative: 8,
    neutral: 12,
    liked_summary: "Kullanıcılar videonun içeriğini ve görsel kalitesini çok beğendi.",
    disliked_summary: "Bazı kullanıcılar ses seviyesinin düşük olduğunu belirtti.",
  };

  // YouTube video ID'sini çıkar
  const extractVideoId = (url) => {
    if (!url.includes("youtube.com/watch?v=")) return null;
    const videoId = url.split("watch?v=")[1]?.slice(0, YOUTUBE_ID_LENGTH);
    return videoId?.length === YOUTUBE_ID_LENGTH ? videoId : null;
  };

  // Backend'den veri çek (şimdilik mock data)
  const handleSubmit = async () => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      setIsValidUrl(false);
      setError("Geçerli bir YouTube video linki girin");
      toast.error("Geçerli bir YouTube video linki girin", {
        position: "top-right",
      });
      return;
    }

    setIsValidUrl(true);
    setIsLoading(true);
    setError(null);

    try {
      // API çalışana kadar mock data
      const response = await fetch(`http://localhost:3000/api/v1/yt-video/${videoId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) throw new Error(data.message);

      setAnalysis(data);
      toast.success("Analiz tamamlandı!", {
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

  // Pasta grafiği verisi
  const chartData = analysis
    ? {
      labels: ["Olumlu", "Olumsuz", "Nötr"],
      datasets: [
        {
          data: [analysis.positive || 0, analysis.negative || 0, analysis.neutral || 0],
          backgroundColor: ["#3B82F6", "#EF4444", "#F59E0B"],
          hoverOffset: 10,
        },
      ],
    }
    : null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* Başlık */}
        <h1 className="text-3xl font-bold text-center text-blue-600">
          YouTube Yorum Analizi
        </h1>
        <p className="text-center text-gray-600">
          Bir YouTube video linki girin, yorumları analiz edelim!
        </p>

        {/* Input ve Buton */}
        <div className="space-y-2">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Video Linki
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
              {isLoading ? "Analiz Ediliyor..." : "Analiz Et"}
            </button>
          </div>
          {!isValidUrl && (
            <p className="text-sm text-red-500">Geçerli bir YouTube linki girin.</p>
          )}
        </div>

        {/* Hata Mesajı */}
        {error && (
          <p className="text-center text-red-500 font-medium">{error}</p>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {/* Analiz Sonuçları */}
        {analysis && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Analiz Sonuçları</h2>
            {/* Pasta Grafiği */}
            <div className="max-w-xs mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Sentiment Dağılımı
              </h3>
              {chartData && (
                <Pie
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      tooltip: { enabled: true },
                    },
                  }}
                />
              )}
            </div>
            {/* Sayılar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-100 rounded-md">
                <p className="font-medium text-blue-800">Olumlu</p>
                <p className="text-2xl font-bold">{analysis.positive || 0}</p>
              </div>
              <div className="p-4 bg-red-100 rounded-md">
                <p className="font-medium text-red-800">Olumsuz</p>
                <p className="text-2xl font-bold">{analysis.negative || 0}</p>
              </div>
              <div className="p-4 bg-yellow-100 rounded-md">
                <p className="font-medium text-yellow-800">Nötr</p>
                <p className="text-2xl font-bold">{analysis.neutral || 0}</p>
              </div>
            </div>
            {/* Özetler */}
            <div className="space-y-2">
              <p className="font-medium text-gray-700">Beğenilenler:</p>
              <p className="text-gray-600">{analysis.liked_summary || "Veri yok"}</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-gray-700">Beğenilmeyenler:</p>
              <p className="text-gray-600">{analysis.disliked_summary || "Veri yok"}</p>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );

}

export default Home