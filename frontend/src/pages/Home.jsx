import { useState } from "react";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnalizeResult from "../components/AnalizeResult";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useSelector } from 'react-redux';
import { useEffect } from "react";
import { analizeVideoComments } from "../services/analizeService";

const Home = () => {

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const YOUTUBE_ID_LENGTH = 11;
  const { t } = useTranslation();

  const [commentLimit, setCommentLimit] = useState("100");
  const [language, setLanguage] = useState(localStorage.getItem("p_analysis_summary_lang") || "tr");

  useEffect(() => {
    localStorage.setItem("p_analysis_summary_lang", language);
  }, [language]);

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
      const res = await analizeVideoComments(videoId, commentLimit, language);
      const data = await res.json();
      console.log(data);
      if (!res.ok || data.success === false) {
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

            <div className="flex gap-4 items-end">

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">
                    {t("home.commentLimitLabel")}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>{t("home.commentLimitHelp")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select value={commentLimit} onValueChange={setCommentLimit} disabled={!isAuthenticated}>
                  <SelectTrigger className="h-8 w-[90px] text-sm px-2">
                    <SelectValue placeholder="100" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={100} value="100">{100}</SelectItem>
                    <SelectItem key={200} value="200">{200}</SelectItem>
                    <SelectItem key={300} value="300">{300}</SelectItem>
                    {/* <SelectItem key={400} value="400">{400}</SelectItem>
                    <SelectItem key={500} value="500">{500}</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">
                    {t("home.languageLabel")}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>{t("home.languageHelp")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select value={language} onValueChange={setLanguage} disabled={!isAuthenticated}>
                  <SelectTrigger className="h-8 w-[110px] text-sm px-2">
                    <SelectValue placeholder={!isAuthenticated ? "English" : "Türkçe"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tr">{t("home.language.tr")}</SelectItem>
                    <SelectItem value="en">{t("home.language.en")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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