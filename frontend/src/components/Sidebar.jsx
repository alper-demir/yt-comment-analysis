import {
    Home, Search, DollarSign, Mail, LogIn, LayoutDashboard, PlusCircle, History, BarChart,
    FileText, Key, ChevronUp, Circle, LogOut, Settings, Receipt, CircleUserRound
} from "lucide-react";

import {
    Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter
} from "@/components/ui/sidebar";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import { logout } from "../services/authService";
import { useTranslation } from "react-i18next";

const publicItems = [
    { key: "home", url: "/", icon: Home },
    { key: "features", url: "/features", icon: Search },
    { key: "pricing", url: "/pricing", icon: DollarSign },
    { key: "contact", url: "/contact", icon: Mail },
    { key: "login", url: "/login", icon: LogIn }
];

const privateItems = [
    { key: "dashboard", url: "/dashboard", icon: LayoutDashboard },
    { key: "newAnalysis", url: "/", icon: PlusCircle },
    { key: "history", url: "/history", icon: History },
    { key: "statistics", url: "/statistics", icon: BarChart },
    { key: "savedReports", url: "/reports", icon: FileText },
    //{ key: "apiAccess", url: "/api-access", icon: Key }
];

const dropdownItems = [
    { key: "account", url: "/account", icon: CircleUserRound },
    { key: "billing", url: "/billing", icon: Receipt },
    { key: "settings", url: "/settings", icon: Settings },
    { key: "signout", url: "/#", onclick: logout, icon: LogOut }
];

const capitalizeFullName = (fullName) => {
    if (!fullName) return "";
    return fullName
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export function AppSidebar() {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const { user } = useSelector((state) => state.user);
    const fullName = user?.firstName + " " + user?.lastName
    const location = useLocation();
    const { t } = useTranslation();

    const items = isAuthenticated
        ? [...privateItems]
        : [...publicItems];

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>{t('sidebar.brand')}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = location.pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                to={item.url}
                                                className={
                                                    isActive
                                                        ? "bg-accent text-accent-foreground font-medium rounded-md"
                                                        : ""
                                                }
                                            >
                                                <item.icon />
                                                <span>
                                                    {t(
                                                        `sidebar.${isAuthenticated ? "private" : "public"}.${item.key
                                                        }`
                                                    )}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {isAuthenticated && (
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton>
                                        <Circle />{fullName && capitalizeFullName(fullName)}
                                        <ChevronUp className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    className="w-60"
                                >
                                    {dropdownItems.map((item, index) => (
                                        <DropdownMenuItem key={index} onClick={item.onclick} asChild>
                                            {item.url ? (
                                                <Link to={item.url} className="cursor-pointer"> <item.icon />
                                                    <span>{t(`sidebar.dropdown.${item.key}`)}</span>
                                                </Link>
                                            ) : (
                                                <span>{t(`sidebar.dropdown.${item.key}`)}</span>
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            )}
        </Sidebar>
    );
}