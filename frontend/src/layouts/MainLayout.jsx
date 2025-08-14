import { Outlet } from 'react-router';
import { AppSidebar } from "@/components/Sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { authNverification } from '../services/authService';
import { useEffect } from 'react';
import { clearUser, setUser } from '../redux/user';
import { useDispatch, useSelector } from 'react-redux';


const MainLayout = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const isAuthenticated = user.isAuthenticated;

    const fetch = async () => {
        if (!isAuthenticated) { // Make API calls only if not logged in
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
            <SidebarTrigger className="m-2 cursor-pointer" />
            <main className='mx-auto w-full max-w-5xl my-20'>
                <Outlet />
            </main>
        </SidebarProvider>
    );
};

export default MainLayout;