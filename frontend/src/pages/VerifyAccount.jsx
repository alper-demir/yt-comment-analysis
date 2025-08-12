import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { verifyAccount } from "../services/authService";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";


const VerifyAccount = () => {

    const { token } = useParams();
    const navigate = useNavigate();

    const verify = async () => {

        const { userId } = jwtDecode(token);
        const response = await verifyAccount(userId);
        const data = await response.json();
        response.ok ? toast.success(data.message) : toast.error(data.message);
        navigate("/login");
    }

    useEffect(() => {
        verify();
    }, [])

    return (
        <div>Account is being verified: {token}</div>
    )
}

export default VerifyAccount