import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Globe, Settings as SettingsIcon, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useDispatch, useSelector } from "react-redux";
import { updateUserPreference } from "../services/userService";
import { toast } from "react-hot-toast";
import { setUser } from "@/redux/user";
import LoadingSpinner from '@/components/LoadingSpinner';
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
    i18n.changeLanguage(value);
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
      <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-x-2">
            <SettingsIcon className="w-6 h-6" /> {t("settings.title")}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Theme Selector */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="font-medium text-sm">{t("settings.theme.label")}</p>
                <p className="text-xs text-muted-foreground">{t("settings.theme.description")}</p>
              </div>
            </div>
            <Select value={theme ?? "light"} onValueChange={changeTheme}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("settings.theme.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-yellow-500" /> {t("settings.theme.options.light")}
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-blue-500" /> {t("settings.theme.options.dark")}
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" /> {t("settings.theme.options.system")}
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">{t("settings.language.label")}</p>
                <p className="text-xs text-muted-foreground">{t("settings.language.description")}</p>
              </div>
            </div>
            <Select value={language ?? "tr-TR"} onValueChange={changeLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("settings.language.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" /> {t(`settings.language.options.${lang.value}`)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium text-sm">{t("settings.notifications.label")}</p>
                <p className="text-xs text-muted-foreground">{t("settings.notifications.description")}</p>
              </div>
            </div>
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