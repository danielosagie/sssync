import { Link } from "react-router-dom";
import { SignedOut, SignedIn } from "@gadgetinc/react";

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <h1 className="text-4xl font-bold mb-6">Welcome to sssync</h1>
      <p className="text-lg mb-8">Your Square & Shopify synchronization solution</p>
      
      <SignedOut>
        <div className="flex gap-4">
          <Link 
            to="/sign-in" 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Sign in
          </Link>
          <Link 
            to="/sign-up"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
          >
            Sign up
          </Link>
        </div>
      </SignedOut>

      <SignedIn>
        <Link 
          to="/sync-dashboard"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Go to Dashboard
        </Link>
      </SignedIn>
    </div>
  );
} 