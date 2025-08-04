import { Outlet } from 'react-router'
import MainLayout from '../layouts/MainLayout'

const PublicRoute = () => {
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    )
}

export default PublicRoute