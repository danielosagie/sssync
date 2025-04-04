import { Link } from "react-router-dom";

interface NotFoundProps{
    signedIn: boolean;
}


const NotFound = ({ signedIn }: NotFoundProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>

            { signedIn ? (
                <Link
                 to="/sync-dashboard" 
                 className="text-blue-600 hover:underline"
                > 
                 Return to Dashboard
                </Link>
                ) : (<Link 
                to = "/home" 
                className="text-blue-600 hover:underline"
                >
                    Return to Home
                </Link>
            )} 


        </div>
    );
};

export default NotFound

