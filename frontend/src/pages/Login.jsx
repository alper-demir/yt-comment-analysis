import { useEffect, useState } from "react";
import { authNverification, login } from "../services/authService";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/user";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Layers } from 'lucide-react';
import PasswordInput from "../components/PasswordInput";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async () => {
        setSubmitting(true);
        try {
            const response = await login(email, password);
            const data = await response.json();
            if (response.ok) {
                dispatch(setUser(data.user));
                localStorage.setItem("token", data.token);
                navigate("/");
                toast.success("Login successful!");
            } else {
                toast.error(data.message || "Login failed");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error("Login error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        authNverification().then((data) => {
            setLoading(false);
            if (data.authNverification) {
                dispatch(setUser(data.user));
                navigate("/");
            }
        });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen px-4">
            <Card className="w-full max-w-md shadow-lg border rounded-2xl">
                <CardHeader>
                    <Layers className="mx-auto" />
                    <CardTitle className="text-center text-2xl font-bold mt-4">Sign in</CardTitle>
                    <CardDescription className="text-center">Access your account to continue</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={submitting}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <button
                                type="button"
                                className="text-sm text-indigo-600 hover:underline"
                                onClick={() => toast("Forgot password clicked")}
                            >
                                Forgot password?
                            </button>
                        </div>
                        <PasswordInput
                            id="newPassword"
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={submitting}
                        />
                    </div>

                    <Button
                        onClick={handleLogin}
                        disabled={submitting}
                        className="w-full cursor-pointer"
                    >
                        {submitting ? <LoadingSpinner size="sm" /> : "Sign in"}
                    </Button>
                </CardContent>

                <CardFooter className="flex justify-center text-sm text-gray-600">
                    <p className="text-center text-sm text-gray-600">
                        Don't you have an account?{" "}
                        <Link to="/register" className="font-medium text-indigo-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;