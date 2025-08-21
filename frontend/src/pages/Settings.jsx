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
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Globe, Settings as SettingsIcon } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from '@/components/ui/switch';
import { updateUserPreference } from "../services/userService";
import { toast } from 'react-hot-toast';
import { setUser } from '@/redux/user';

const Settings = () => {

  const { user } = useSelector(state => state.user);

  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("tr-TR");
  const [emailNotifications, setEmailNotifications] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setEmailNotifications(user?.UserPreference?.emailNotifications);
      setLanguage(user?.UserPreference?.language);
      setTheme(user?.UserPreference?.theme);
    }
  }, [user])

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

    let doc = document.querySelector("html");
    if (value === "light") {
      localStorage.setItem("theme", "light");
      doc.classList.remove("dark");
    }
    if (value === "dark") {
      localStorage.setItem("theme", "dark");
      doc.classList.add("dark");
    }
    if (value === "system") {
      localStorage.setItem("theme", "system");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        doc.classList.add("dark");
      } else {
        doc.classList.remove("dark");
      }
    }
  }
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
  }

  const changeEmailNotifications = async (value) => {
    const response = await updateUserPreference({ emailNotifications: value }, user.id);
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    dispatch(setUser(data.user));
    setEmailNotifications((prev) => !prev);
  }

  const languages = [
    { value: "tr-TR", label: "Türkçe" },
    { value: "en-US", label: "English" }
  ];

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            <div className="flex items-center gap-x-2"><SettingsIcon /> <span>Settings</span></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selector */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Theme</Label>
            <Select value={theme} onValueChange={changeTheme}>
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
            <Select value={language} onValueChange={changeLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  {languages.map((lang) => (
                    <SelectItem
                      key={lang.value}
                      value={lang.value}
                      className="flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4" /> {lang.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notification">Email Notifications</Label>
            <Switch id="email-notification" checked={emailNotifications}
              onCheckedChange={changeEmailNotifications} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
