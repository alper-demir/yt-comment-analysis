import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from 'react-hot-toast';
import { createContactRecord } from "@/services/userService";
import { useTranslation } from "react-i18next";

const MAX_MESSAGE_LENGTH = 400;

const ContactPage = () => {
    const { t } = useTranslation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !subject || !message) {
            toast.error(t("contact.fillAllFields"));
            return;
        }
        if (!emailRegex.test(email)) {
            toast.error(t("contact.invalidEmail"));
            return;
        }
        setIsSubmitting(true);
        const res = await createContactRecord({ name, email, subject, message });
        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message);
            setIsSubmitting(false);
            return;
        }

        toast.success(t("contact.successMessage"));
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setIsSubmitting(false);
    };

    return (
        <div className="max-h-screen flex flex-col items-center justify-center px-4 py-16 space-y-8">
            <Card className="w-full max-w-lg shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">{t("contact.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="name">{t("contact.name")}</Label>
                            <Input
                                id="name"
                                placeholder={t("contact.namePlaceholder")}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="email">{t("contact.email")}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t("contact.emailPlaceholder")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="subject">{t("contact.subject")}</Label>
                            <Input
                                id="subject"
                                placeholder={t("contact.subjectPlaceholder")}
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="message">{t("contact.message")}</Label>
                            <Textarea
                                id="message"
                                placeholder={t("contact.messagePlaceholder")}
                                value={message}
                                onChange={(e) =>
                                    e.target.value.length <= MAX_MESSAGE_LENGTH &&
                                    setMessage(e.target.value)
                                }
                                required
                                className="h-32 max-h-48"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                {message.length}/{MAX_MESSAGE_LENGTH} {t("contact.characters")}
                            </p>
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? t("contact.sending") : t("contact.sendButton")}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5" />
                <span>alper.demirr23@gmail.com</span>
            </div>
        </div>
    );
};

export default ContactPage;