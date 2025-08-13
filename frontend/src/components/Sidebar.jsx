import { Calendar, Home, Inbox, Search, Settings, History, ChevronUp } from "lucide-react"

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
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

import { useSelector } from "react-redux";
import { Link } from "react-router";

const publicItems = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Inbox",
        url: "/inbox",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "/calendar",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    }
]

const privateItems = [
    {
        title: "History",
        url: "/history",
        icon: History,
    }
]

const dropdownItems = [
    {
        title: "Account",
        url: "/account",
    },
    {
        title: "Billing",
        url: "/billing",
    },
    {
        title: "Settings",
        url: "/settings",
    },
    {
        title: "Signout",
        url: "/signout",
    }
]

export function AppSidebar() {

    let items = [];

    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    console.log("AppSidebar isAuthenticated:", isAuthenticated);
    isAuthenticated ? items = [...publicItems, ...privateItems] : items = [...publicItems];

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>YouTube Comment Analysis</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* footer */}
            {
                isAuthenticated && (
                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton>
                                            Username
                                            <ChevronUp className="ml-auto" />
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        side="top"
                                        className="w-[--radix-popper-anchor-width]"
                                    >
                                        {
                                            dropdownItems.map((item, index) => (
                                                <DropdownMenuItem key={index}>
                                                    {item.url ? (<Link to={item.url}>{item.title}</Link>) : (<span>{item.title}</span>)}
                                                </DropdownMenuItem>
                                            ))
                                        }
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                )
            }
        </Sidebar>
    )
}