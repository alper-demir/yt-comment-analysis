import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const ErrorPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="max-w-md w-full shadow-lg rounded-2xl text-center">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-bold">
                        <AlertCircle className="w-6 h-6 text-red-500" /> {t("error.title")}
                    </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-4">
                    <p className="text-sm sm:text-base">{t("error.message1")}</p>
                    <p className="text-sm sm:text-base">{t("error.message2")}</p>
                    <div className="flex justify-center gap-4 mt-4">
                        <Button variant="default" onClick={() => navigate("/")}>
                            {t("error.home")}
                        </Button>
                        <Button variant="outline" onClick={() => navigate(-1)}>
                            {t("error.back")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ErrorPage;