import { useState } from "react";
import { register } from "../services/authService";
import LoadingSpinner from "../components/LoadingSpinner";

const Register = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const mailRegex = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const passwordRegex = (password) => {
        // Minimum 8 karakter, en az 1 harf ve 1 rakam içermeli
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleRegister = async () => {

        if (!mailRegex(email)) {
            alert("Geçerli bir e-posta girin.");
            return;
        }

        if (!passwordRegex(password)) {
            alert("Şifre en az 8 karakter, en az 1 harf ve 1 rakam içermelidir.");
            return;
        }

        setLoading(true);

        const response = await register(email, password);
        const data = await response.json();
        if (response.ok) {
            console.log(data);
        } else {
            // Notify user
        }
        setLoading(false);
        console.log(response.ok);
    }

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" className="mx-auto h-10 w-auto" />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Register</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action="#" method="POST" className="space-y-6">
                    <div>
                        <label for="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                        <div className="mt-2">
                            <input id="email" type="email" name="email" required autocomplete="email" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" onChange={(e) => setEmail(e.target.value)} value={email} />
                        </div>
                    </div>

                    <div className="mt-2">
                        <input id="password" type="password" name="password" required autocomplete="current-password" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" onChange={(e) => setPassword(e.target.value)} value={password} />
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={handleRegister}
                            className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:cursor-not-allowed ${loading ? 'bg-indigo-400 opacity-80' : 'bg-indigo-600'}`}
                            disabled={loading}
                        >
                            <span className="mr-2">Register</span>
                            {loading && <LoadingSpinner color="blue" size="md" />}
                        </button>
                    </div>

                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Not a member?
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Start a 14 day free trial</a>
                </p>
            </div>
        </div>
    )
}

export default Register