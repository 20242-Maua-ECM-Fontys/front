import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate, MsalProvider} from '@azure/msal-react';
import { loginRequest } from '@/components/layouts/auth-config';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const LoginRoute = () => {
    const navigate = useNavigate();
    const { instance , accounts} = useMsal();
        
    const handleLogin = (instance: any) => {
        instance.loginPopup().catch((e: any) => {
            console.error(e);
        });
    };

    const handleLogout = (instance: any) => {
        instance.logoutPopup().catch((e: any) => {
            console.error(e);
        });
    }

    useEffect(() => {
        if (accounts.length > 0) {
            navigate('/app');
        }
        }, [accounts]);

    return (
        <div className="flex h-screen items-center bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
            <h2 className="p-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                <span className="block">Welcome to MauaGrid</span>
            </h2>
            <p>Building your Schedules in a straightforward manner</p>
            {accounts.length > 0 ? (
                    <div>
                        <p> Welcome, {accounts[0].name}</p>
                        {/* <email>*/}
                        <p>Username: {accounts[0].username}</p>
                
                        <button className="mt-4 rounded bg-gray-200 px-4 py-2  transition duration-300 hover:bg-blue-400 hover:text-white"
                        onClick={() => handleLogout(instance)}>Logout</button>
                    </div>
                ) : (
                    <button className="mt-4 rounded bg-gray-200 px-4 py-2  transition duration-300 hover:bg-blue-400 hover:text-white"
                    onClick={() => handleLogin(instance)}>Login</button>
                )}
            </div>
        </div>
        );
};

export default LoginRoute;
 