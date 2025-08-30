import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { changePassword, getUserInfo, updateUserInfo } from "../services/userService";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { setUser } from "../redux/user";
import PasswordInput from "../components/PasswordInput";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

const Account = () => {

    const { t } = useTranslation();
    const user = useSelector(state => state.user.user)
    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState("John");
    const [lastName, setLastName] = useState("Doe");
    const [email, setEmail] = useState("johndoe@example.com");
    const [profileSaving, setProfileSaving] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordUpdating, setPasswordUpdating] = useState(false);

    const [loadingProfile, setLoadingProfile] = useState(true);

    const passwordRegex = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)

    const normalizeName = (name) => {
        return name.trim().replace(/\s+/g, ' ');
    }

    const capitalizeWords = (str) => {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }

    const onlyLettersAndSpaceRegex = /^[A-Za-z\s]+$/;

    const handleSaveProfile = async () => {
        if (!user?.id) return;
        if (!firstName || !lastName) return toast.error(t("account.errors.nameRequired"));
        setProfileSaving(true);

        const normalizedFirstName = normalizeName(firstName);
        const normalizedLastName = normalizeName(lastName);

        const res = await updateUserInfo({
            firstName: normalizedFirstName.toLowerCase(),
            lastName: normalizedLastName.toLowerCase()
        }, user.id);
        const data = await res.json();
        if (!res.ok) {
            toast.error(data.message);
            setProfileSaving(false);
            return;
        }
        toast.success(t("account.success.profileUpdated"));
        localStorage.setItem("token", data.token);
        dispatch(setUser(data.user));
        setProfileSaving(false);
    };

    const handleChangePassword = async () => {
        if (!user?.id) return;
        if (!currentPassword || !newPassword || !confirmPassword) return toast.error(t("account.errors.allFieldsRequired"));
        if (!passwordRegex(newPassword)) return toast.error(t("account.errors.passwordInvalid"));
        if (newPassword !== confirmPassword) return toast.error(t("account.errors.passwordMismatch"));
        try {
            setPasswordUpdating(true);
            const res = await changePassword({ oldPassword: currentPassword, newPassword: newPassword }, user.id);
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message);
                return;
            }
            toast.success(t("account.success.passwordUpdated"));
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {
            toast.error(t("account.errors.passwordUpdateFailed") + error.message);
        } finally {
            setPasswordUpdating(false);
        }
    };

    const fetchUserInfo = async () => {
        if (!user?.id) return;
        setLoadingProfile(true);
        try {
            const res = await getUserInfo(user.id);
            const data = await res.json();
            console.log(data)
            if (!res.ok) {
                toast.error(data.message);
                return;
            }

            setFirstName(capitalizeWords(data.firstName));
            setLastName(capitalizeWords(data.lastName));
            setEmail(data.email);
            setIsVerified(data.verified)
        } catch (err) {
            toast.error(t("account.errors.loadFailed") + err.message);
        } finally {
            setLoadingProfile(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, [user])

    return (
        <div className="container mx-auto py-6 px-2 max-sm:px-3">
            <h1 className="text-2xl font-bold mb-6 text-center">{t("account.title")}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile */}
                <Card className="shadow-lg">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>{t("account.profile.title")}</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center">
                                    <p>{t("account.profile.tooltip")}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="firstName">{t("account.profile.firstName")}</Label>
                                {loadingProfile ? <Skeleton className="h-9 w-full rounded-md" /> :
                                    <Input id="firstName" value={firstName} onChange={e => /^[A-Za-z\s]*$/.test(e.target.value) && setFirstName(e.target.value)}
                                        onBlur={() => setFirstName(capitalizeWords(normalizeName(firstName)))} />}
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="lastName">{t("account.profile.lastName")}</Label>
                                {loadingProfile ? <Skeleton className="h-9 w-full rounded-md" /> :
                                    <Input id="lastName" value={lastName} onChange={e => { let val = normalizeName(e.target.value); onlyLettersAndSpaceRegex.test(val) && setLastName(capitalizeWords(val)); }} />}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t("account.profile.email")}</Label>
                            {loadingProfile ? <Skeleton className="h-9 w-full rounded-md" /> :
                                <Input id="email" value={email} readOnly disabled className="bg-gray-100 cursor-not-allowed" />}
                        </div>
                        <Button onClick={handleSaveProfile} disabled={profileSaving} className={`w-full flex justify-center items-center ${profileSaving ? "cursor-not-allowed opacity-60" : ""}`}>
                            {profileSaving && <LoadingSpinner size="sm" className="mr-2" />}
                            {t("account.profile.save")}
                        </Button>
                        <div>
                            <span className="flex items-center gap-2 text-sm">
                                {t("account.profile.status")}:
                                <Badge variant={isVerified ? "default" : "destructive"}>
                                    {isVerified ? t("account.profile.verified") : t("account.profile.unverified")}
                                </Badge>
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card className="shadow-lg">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>{t("account.security.title")}</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center">
                                    <p>{t("account.security.tooltip")}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">{t("account.security.currentPassword")}</Label>
                            <PasswordInput id="currentPassword" type="password" placeholder="********" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">{t("account.security.newPassword")}</Label>
                            <PasswordInput id="newPassword" type="password" placeholder="********" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">{t("account.security.confirmPassword")}</Label>
                            <PasswordInput id="confirmPassword" type="password" placeholder="********" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                        </div>
                        <Button onClick={handleChangePassword} disabled={passwordUpdating} className={`w-full flex justify-center items-center ${passwordUpdating ? "cursor-not-allowed opacity-60" : ""}`}>
                            {passwordUpdating && <LoadingSpinner size="sm" className="mr-2" />}
                            {t("account.security.changePassword")}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Account;