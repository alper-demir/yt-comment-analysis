import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router";
import { AlertCircle } from "lucide-react";

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="max-w-md w-full shadow-lg rounded-2xl text-center">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-bold">
                        <AlertCircle className="w-6 h-6 text-red-500" /> Oops! Something went wrong
                    </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-4">
                    <p className="text-sm sm:text-base">
                        The page you are looking for does not exist, or an unexpected error occurred.
                    </p>
                    <p className="text-sm sm:text-base">
                        You can return to the homepage or check your URL.
                    </p>
                    <div className="flex justify-center gap-4 mt-4">
                        <Button
                            variant="default"
                            onClick={() => navigate("/")}
                        >
                            Go to Home
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                        >
                            Go Back
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ErrorPage;