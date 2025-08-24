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

const Register = () => {

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
            toast.error("Please enter a valid email address.")
            return;
        }
        if (!passwordRegex(password)) {
            toast.error("Password must be at least 8 characters, contain at least 1 letter and 1 number.")
            return;
        }
        if (!acceptedTerms) {
            toast.error("You must accept the terms and privacy policy to continue.")
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
                    <CardTitle className="mt-4 text-2xl font-bold tracking-tight">Create your account</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* First + Last Name */}
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="John"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            At least 8 characters, 1 letter and 1 number
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
                            I agree to the{" "}
                            <a href="/terms" className="text-indigo-600 hover:underline" target="_blank">
                                Terms
                            </a>{" "}
                            and{" "}
                            <a href="/privacy" className="text-indigo-600 hover:underline" target="_blank">
                                Privacy Policy
                            </a>
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
                                <span>Registering...</span>
                            </div>
                        ) : (
                            "Register"
                        )}
                    </Button>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Register