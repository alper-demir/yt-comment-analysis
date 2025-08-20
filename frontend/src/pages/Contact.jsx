import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from 'react-hot-toast';

const MAX_MESSAGE_LENGTH = 400;

const ContactPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // API call 
        setTimeout(() => {
            toast.success("Your message has been sent!");
            setName("");
            setEmail("");
            setMessage("");
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className="max-h-screen flex flex-col items-center justify-center px-4 py-16 space-y-8">
            <Card className="w-full max-w-lg shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Your message"
                                value={message}
                                onChange={(e) =>
                                    e.target.value.length <= MAX_MESSAGE_LENGTH &&
                                    setMessage(e.target.value)
                                }
                                required
                                className="h-32 max-h-48"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                {message.length}/{MAX_MESSAGE_LENGTH} characters
                            </p>
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5" />
                <span>contact@ytanaysisapp.com</span>
            </div>
        </div>
    );
};

export default ContactPage;