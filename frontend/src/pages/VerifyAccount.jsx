import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { verifyAccount } from "@/services/authService";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";

const VerifyAccount = () => {

    const { t } = useTranslation();
    const { token } = useParams();
    const navigate = useNavigate();

    const verify = async () => {

        const { userId } = jwtDecode(token);
        const response = await verifyAccount(userId);
        const data = await response.json();
        response.ok ? toast.success(data.message) : toast.error(data.message);
        navigate("/login");
    }

    useEffect(() => {
        verify();
    }, [])

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-[400px] text-center">
                <CardHeader>
                    <CardTitle>{t("verifyAccount.verifying")}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center mt-4">
                    <LoadingSpinner />
                </CardContent>
            </Card>
        </div>
    )
}

export default VerifyAccount