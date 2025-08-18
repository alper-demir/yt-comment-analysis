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

const Settings = () => {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("tr-TR");

  const changeTheme = (value) => {
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
  const changeLanguage = (value) => setLanguage(value);

  const initTheme = () => {
    const theme = localStorage.getItem("theme");
    if (theme) setTheme(theme);
  }

  useEffect(() => {
    initTheme();
  }, [])

  const languages = [
    { value: "tr-TR", label: "Türkçe" },
    { value: "en-US", label: "English" },
    { value: "fr-FR", label: "Français" },
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
