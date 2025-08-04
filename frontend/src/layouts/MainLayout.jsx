import { Outlet } from 'react-router';
import { AppSidebar } from "@/components/Sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


const MainLayout = () => {

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            <main className='mx-auto max-w-5xl mt-20'>
                <Outlet />
            </main>
        </SidebarProvider>
    );
}

export default MainLayout;