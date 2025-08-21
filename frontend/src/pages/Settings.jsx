import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Shadcn UI Skeleton
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Globe, Settings as SettingsIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useDispatch, useSelector } from "react-redux";
import { updateUserPreference } from "../services/userService";
import { toast } from "react-hot-toast";
import { setUser } from "@/redux/user";
import LoadingSpinner from '@/components/LoadingSpinner';

const Settings = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(null);
  const [language, setLanguage] = useState(null);
  const [emailNotifications, setEmailNotifications] = useState(null);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setTheme(user?.UserPreference?.theme ?? "light");
      setLanguage(user?.UserPreference?.language ?? "tr-TR");
      setEmailNotifications(user?.UserPreference?.emailNotifications ?? true);
      setLoading(false);
    }
  }, [user]);

  const changeTheme = async (value) => {
    const response = await updateUserPreference({ theme: value }, user.id);
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    dispatch(setUser(data.user));
    setTheme(value);

    const doc = document.documentElement;
    if (value === "light") {
      localStorage.setItem("theme", "light");
      doc.classList.remove("dark");
    } else if (value === "dark") {
      localStorage.setItem("theme", "dark");
      doc.classList.add("dark");
    } else if (value === "system") {
      localStorage.setItem("theme", "system");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        doc.classList.add("dark");
      } else {
        doc.classList.remove("dark");
      }
    }
  };

  const changeLanguage = async (value) => {
    const response = await updateUserPreference({ language: value }, user.id);
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    dispatch(setUser(data.user));
    setLanguage(value);
  };

  const changeEmailNotifications = async (value) => {
    const response = await updateUserPreference({ emailNotifications: value }, user.id);
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    dispatch(setUser(data.user));
    setEmailNotifications(value);
  };

  const languages = [
    { value: "tr-TR", label: "Türkçe" },
    { value: "en-US", label: "English" },
  ];

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-x-2">
            <SettingsIcon /> Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selector */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Theme</Label>
            <Select value={theme ?? "light"} onValueChange={changeTheme}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Theme</SelectLabel>
                  <SelectItem value="light" className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-yellow-500" /> Light
                  </SelectItem>
                  <SelectItem value="dark" className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-blue-500" /> Dark
                  </SelectItem>
                  <SelectItem value="system" className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" /> System
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Language</Label>
            <Select value={language ?? "tr-TR"} onValueChange={changeLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value} className="flex items-center gap-2">
                      <Globe className="w-4 h-4" /> {lang.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notification">Email Notifications</Label>
            <Switch
              id="email-notification"
              checked={!!emailNotifications}
              onCheckedChange={changeEmailNotifications}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
