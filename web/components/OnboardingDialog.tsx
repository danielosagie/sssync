import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { api } from '../api';
import { SquareConnect } from './SquareConnect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Check, Store, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export function OnboardingDialog({
  isOpen,
  setIsOpen,
  onComplete,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onComplete?: () => void;
}) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSquareConnected, setIsSquareConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check URL params for connection status
    const params = new URLSearchParams(location.search);
    const connected = params.get('square_connected');
    
    if (connected === 'true') {
      setIsSquareConnected(true);
      setIsOpen(false);
      if (onComplete) onComplete();
    } else if (connected === 'false') {
      setError("Failed to connect Square account");
    }
  }, [location.search]);

  const startSquareOAuth = async () => {
    if (!user) {
      setError("User not logged in");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await api.mutate(`
        mutation SquareOAuth {
          squareOAuth {
            success
            errors {
              message
            }
            result
          }
        }
      `);

      if (result.squareOAuth?.success) {
        console.log("result.SquareOAuth.result.result.authUrl");
        console.log(result.squareOAuth.result.result.authUrl);
        const authUrl = result.squareOAuth.result.result.authUrl;
        if (authUrl) {
          window.location.href = authUrl;
        } else {
          setError("Failed to get OAuth URL");
        }
      } else {
        setError(result.squareOAuth?.errors?.[0]?.message || "Unknown error");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Square</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Square connection status */}
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSquareConnected ? 'bg-green-500' : 'bg-gray-200'}`}>
              {isSquareConnected ? <Check className="text-white" /> : <RefreshCw className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Square Account</h3>
              <p className="text-sm text-gray-500">
                {isSquareConnected
                  ? 'Connected successfully'
                  : 'Connect your Square account'}
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* Connect Square button */}
          <Button
            onClick={startSquareOAuth}
            disabled={isLoading || isSquareConnected}
            className="w-full"
          >
            {isLoading ? 'Connecting...' : 'Connect Square'}
          </Button>

          {/* Cancel prompt */}
          <p className="text-sm text-gray-500 text-center mt-4">
            Click outside this box to cancel onboarding.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function OnboardingButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      className="bg-black text-white p-4"
      onClick={onClick}
    >
      Start Onboarding!
    </Button>
  );
} 