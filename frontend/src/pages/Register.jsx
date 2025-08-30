import { useState } from "react"
import { register } from "../services/authService"
import LoadingSpinner from "../components/LoadingSpinner"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Link, useNavigate } from "react-router"
import { Layers } from 'lucide-react';
import toast from "react-hot-toast"
import PasswordInput from "../components/PasswordInput"
import { useTranslation, Trans } from "react-i18next"

const Register = () => {
    const { t } = useTranslation()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const mailRegex = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const passwordRegex = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)

    const normalizeName = (name) => {
        return name.trim().toLowerCase();
    }

    const handleRegister = async () => {
        if (!mailRegex(email)) {
            toast.error(t("register.errors.invalidEmail"))
            return;
        }
        if (!passwordRegex(password)) {
            toast.error(t("register.errors.invalidPassword"))
            return;
        }
        if (!acceptedTerms) {
            toast.error(t("register.errors.acceptTerms"))
            return;
        }

        setLoading(true)
        try {
            const response = await register(email, password, normalizeName(firstName), normalizeName(lastName))
            const data = await response.json()
            if (response.ok) {
                console.log("Register success:", data)
                navigate("/login")
            } else {
                console.error("Register failed:", data)
            }
        } catch (error) {
            console.error("Register error:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen items-center justify-center px-4">
            <Card className="w-full max-w-md shadow-lg rounded-2xl">
                <CardHeader className="text-center">
                    <Layers className="mx-auto" />
                    <CardTitle className="mt-4 text-2xl font-bold tracking-tight">
                        {t("register.title")}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                    <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="firstName">{t("register.firstName")}</Label>
                            <Input
                                id="firstName"
                                type="text"
                                placeholder={t("register.placeholders.firstName")}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="lastName">{t("register.lastName")}</Label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder={t("register.placeholders.lastName")}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">{t("register.email")}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={t("register.placeholders.email")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">{t("register.password")}</Label>
                        <PasswordInput
                            id="newPassword"
                            type="password"
                            placeholder={t("register.placeholders.password")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            {t("register.passwordHint")}
                        </p>
                    </div>

                    {/* Terms */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={acceptedTerms}
                            onCheckedChange={(val) => setAcceptedTerms(!!val)}
                        />
                        <Label htmlFor="terms" className="text-sm text-gray-600">
                            {/* Label gives gap-2 default, it gives blank spaces between tags, to solve this <Trans> wrapped with span tag */}
                            <span className="">
                                <Trans i18nKey="register.terms.fullText" components={{
                                    1: <a href="/terms" className="text-indigo-600 hover:underline m-0" target="_blank" />,
                                    2: <a href="/privacy" className="text-indigo-600 hover:underline m-0" target="_blank" />
                                }} />
                            </span>
                        </Label>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        onClick={handleRegister}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <LoadingSpinner size="sm" color="white" />
                                <span>{t("register.loading")}</span>
                            </div>
                        ) : (
                            t("register.button")
                        )}
                    </Button>

                    <p className="text-center text-sm text-gray-600">
                        {t("register.alreadyAccount")}{" "}
                        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
                            {t("register.signIn")}
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div >
    )
}

export default Register