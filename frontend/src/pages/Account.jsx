import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
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

const Account = () => {

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

    const verified = true;

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
        if (!firstName || !lastName) return toast.error("First name and last name are required!");
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
        toast.success("Profile updated!");
        localStorage.setItem("token", data.token);
        dispatch(setUser(data.user));
        setProfileSaving(false);
    };

    const handleChangePassword = async () => {

        if (!user?.id) return;

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All fields are required");
            return;
        }

        if (!passwordRegex(newPassword)) {
            toast.error("Password must be at least 8 characters, contain at least 1 letter and 1 number.")
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setPasswordUpdating(true);
            const res = await changePassword({ oldPassword: currentPassword, newPassword: newPassword }, user.id);
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message);
                return;
            }

            toast.success("Password updated!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {
            toast.error("Failed to update password" + error.message);
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
            toast.error("Failed to load user info" + err.message);
        } finally {
            setLoadingProfile(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, [user])

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Account Settings</h1>

            {/* Grid layout: Profile | Security */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Information */}
                <Card className="shadow-lg">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Profile Information</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center">
                                    <p>Update your personal information and preferences.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                {loadingProfile ? (
                                    <Skeleton className="h-9 w-full rounded-md" />
                                ) : (
                                    <Input
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^[A-Za-z\s]*$/.test(val)) {
                                                setFirstName(val);
                                            }
                                        }}
                                        onBlur={() => setFirstName(capitalizeWords(normalizeName(firstName)))}
                                    />
                                )}
                            </div>

                            <div className="flex-1 space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                {loadingProfile ? (
                                    <Skeleton className="h-9 w-full rounded-md" />
                                ) : (
                                    <Input
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => {
                                            let val = normalizeName(e.target.value);
                                            if (onlyLettersAndSpaceRegex.test(val) || val === "") {
                                                setLastName(capitalizeWords(val));
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            {loadingProfile ? (
                                <Skeleton className="h-9 w-full rounded-md" />
                            ) : (
                                <Input
                                    id="email"
                                    value={email}
                                    readOnly
                                    disabled
                                    className="bg-gray-100 cursor-not-allowed"
                                />
                            )}
                        </div>
                        <Button
                            onClick={handleSaveProfile}
                            disabled={profileSaving}
                            className={`w-full flex justify-center items-center ${profileSaving ? "cursor-not-allowed opacity-60" : ""}`}
                        >
                            {profileSaving && <LoadingSpinner size="sm" className="mr-2" />}
                            Save Profile
                        </Button>

                        <div>
                            <span className="flex items-center gap-2 text-sm" >
                                Account Verified:
                                <Badge variant={isVerified ? "default" : "destructive"}>
                                    {isVerified ? "Verified" : "Unverified"}
                                </Badge>
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card className="shadow-lg">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Security</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center">
                                    <p>Change your password to keep your account secure.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <PasswordInput
                                id="currentPassword"
                                type="password"
                                placeholder="********"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <PasswordInput
                                id="newPassword"
                                type="password"
                                placeholder="********"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <PasswordInput
                                id="confirmPassword"
                                type="password"
                                placeholder="********"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <Button
                            onClick={handleChangePassword}
                            disabled={passwordUpdating}
                            className={`w-full flex justify-center items-center ${passwordUpdating ? "cursor-not-allowed opacity-60" : ""}`}
                        >
                            {passwordUpdating && <LoadingSpinner size="sm" className="mr-2" />}
                            Change Password
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Account;
