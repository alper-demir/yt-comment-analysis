import { Outlet } from 'react-router';
import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { authNverification } from '../services/authService';
import { useEffect } from 'react';
import { clearUser, setUser } from '../redux/user';
import { useDispatch, useSelector } from 'react-redux';

const MainLayout = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const isAuthenticated = user.isAuthenticated;

    const fetch = async () => {
        if (!isAuthenticated) {
            const response = await authNverification();
            if (response?.authNverification) {
                dispatch(setUser(response.user));
            } else {
                dispatch(clearUser());
            }
            console.log(response);
        }
    };

    useEffect(() => {
        fetch();
    }, [location.pathname, isAuthenticated]);

    return (
        <SidebarProvider>
            <AppSidebar />
            <div className='w-full relative flex flex-col min-h-screen'>
                <SidebarTrigger className="m-2 cursor-pointer fixed top-0 z-50" />
                <main className='mx-auto w-full max-w-5xl my-20 relative flex-1'>
                    <Outlet />
                </main>
                <footer className='w-full  text-center py-4 mt-auto'>
                    © {new Date().getFullYear()} YtLens. All rights reserved.
                </footer>
            </div>
        </SidebarProvider>
    );
};

export default MainLayout;