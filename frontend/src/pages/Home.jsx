import { useState } from "react";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnalizeResult from "../components/AnalizeResult";
import { useTranslation } from "react-i18next";


const Home = () => {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const YOUTUBE_ID_LENGTH = 11;
  const token = localStorage.getItem("token");
  const { t } = useTranslation();

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
      const msg = t("home.errors.invalidUrl");
      setError(msg);
      toast.error(msg);
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
      if (!response.ok || data.success === false) {
        toast.error(data.message);
        return;
      }
      toast.success(t("home.success.analysisCompleted"));
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-6">
      <Card className="w-full max-w-3xl shadow-lg border">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">
            {t("home.title")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("home.description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="url">{t("home.videoLabel")}</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                type="text"
                placeholder={t("home.videoPlaceholder")}
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
                {isLoading ? t("home.analyzing") : t("home.analyzeButton")}
              </Button>
            </div>
            {!isValidUrl && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          {isLoading && <LoadingSpinner size="md" />}

          {analysis && (
            <AnalizeResult analysis={analysis} videoId={extractVideoId(url)} />
          )}
        </CardContent>
      </Card>
    </div>
  );

}

export default Home