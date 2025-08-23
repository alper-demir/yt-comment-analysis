import {
    Home,
    Search,
    DollarSign,
    Mail,
    LogIn,
    LayoutDashboard,
    PlusCircle,
    History,
    BarChart,
    FileText,
    Key,
    ChevronUp,
    Circle
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter
} from "@/components/ui/sidebar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "./ui/dropdown-menu";

import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import { logout } from "../services/authService";

const publicItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Features", url: "/features", icon: Search },
    { title: "Pricing", url: "/pricing", icon: DollarSign },
    { title: "Contact", url: "/contact", icon: Mail },
    { title: "Login", url: "/login", icon: LogIn }
];

const privateItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "New Analysis", url: "/", icon: PlusCircle },
    { title: "History", url: "/history", icon: History },
    { title: "Statistics", url: "/statistics", icon: BarChart },
    { title: "Saved Reports", url: "/reports", icon: FileText },
    { title: "API Access", url: "/api-access", icon: Key }
];

const dropdownItems = [
    { title: "Account", url: "/account" },
    { title: "Billing", url: "/billing" },
    { title: "Settings", url: "/settings" },
    { title: "Signout", url: "/#", onclick: logout }
];

export function AppSidebar() {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const { email } = useSelector((state) => state.user.user || "");
    const location = useLocation();

    const items = isAuthenticated
        ? [...privateItems]
        : [...publicItems];

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>YouTube Comment Analysis</SidebarGroupLabel>
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
                                                <span>{item.title}</span>
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
                                        <Circle />{email && email}
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
                                                <Link to={item.url} className="cursor-pointer">{item.title}</Link>
                                            ) : (
                                                <span>{item.title}</span>
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