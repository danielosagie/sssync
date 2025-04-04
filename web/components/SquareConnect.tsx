import { useState, useEffect } from 'react';
import { api } from '../api';
import { Button } from './ui/button';
import { Store, RefreshCw, Check } from 'lucide-react';
import { Card, CardContent, CardDescription } from './ui/card';
import { useSession } from "@gadgetinc/react";

interface SquareConnectProps {
  shopId: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
  onSuccess?: () => void;
}

interface ConnectionStatus {
  isConnected: boolean;
  merchantName?: string;
  locations?: { id: string; name: string }[];
  error?: string;
}

export function SquareConnect({ 
  shopId, 
  variant = "default",
  size = "default",
  className = "",
  onSuccess 
}: SquareConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus>({ isConnected: false });
  const [error, setError] = useState<string | null>(null);
  const { get } = useSession();

  useEffect(() => {
    checkConnectionStatus();
  }, [shopId]);

  const checkConnectionStatus = async () => {
    try {
      const result = await api.query(`
        query GetSellerByShopId($shopifyShopId: String!) {
          getSellerByShopId(shopifyShopId: $shopifyShopId) {
            success
            isConnected
            businessName
            locations {
              id
              name
            }
            errors {
              message
            }
          }
        }
      `, {
        shopifyShopId: shopId
      });

      if (result?.getSellerByShopId?.isConnected) {
        setStatus({
          isConnected: true,
          merchantName: result.getSellerByShopId.businessName,
          locations: result.getSellerByShopId.locations
        });
      } else {
        setStatus({ isConnected: false });
      }
    } catch (error) {
      console.error('Failed to check connection status:', error);
      setStatus({ 
        isConnected: false, 
        error: 'Failed to check connection status' 
      });
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      // Step 1: Check if the seller is already connected
      const sellerResult = await api.mutate(`
        mutation GetSellerByShopId($id: GadgetID!) {
          getSellerByShopIdSeller(id: $id) {
            success
            result {
              isConnected
              businessName
              locations {
                id
                name
              }
            }
            errors {
              message
            }
          }
        }
      `, {
        id: shopId
      });

      if (sellerResult?.getSellerByShopIdSeller?.success) {
        const sellerData = sellerResult.getSellerByShopIdSeller.result;

        if (sellerData.isConnected) {
          // Seller is already connected
          setStatus({
            isConnected: true,
            merchantName: sellerData.businessName,
            locations: sellerData.locations
          });
          onSuccess?.();
        } else {
          // Step 2: Initiate Square OAuth if not connected
          const oauthResult = await api.mutate(`
            mutation SquareOAuth($shopifyShopId: String!) {
              squareOAuth(shopifyShopId: $shopifyShopId) {
                success
                result {
                  authUrl
                }
                errors {
                  message
                }
              }
            }
          `, {
            shopifyShopId: shopId
          });

          if (oauthResult?.squareOAuth?.success) {
            const authUrl = oauthResult.squareOAuth.result.authUrl;
            const authWindow = window.open(
              authUrl, 
              'square-oauth', 
              'width=600,height=600'
            );
            
            // Step 3: Listen for the callback message
            const handleMessage = async (event: MessageEvent) => {
              if (event.data.type === 'SQUARE_OAUTH_CALLBACK' && event.data.code) {
                try {
                  await api.mutate(`
                    mutation SquareOAuthCallback($code: String!, $shopifyShopId: String!) {
                      squareOAuthCallback(code: $code, shopifyShopId: $shopifyShopId) {
                        success
                        errors {
                          message
                        }
                      }
                    }
                  `, {
                    code: event.data.code,
                    shopifyShopId: shopId
                  });
                  
                  // Step 4: Verify the connection after callback
                  const verifyResult = await api.mutate(`
                    mutation GetSellerByShopId($id: GadgetID!) {
                      getSellerByShopIdSeller(id: $id) {
                        success
                        result {
                          isConnected
                          businessName
                          locations {
                            id
                            name
                          }
                        }
                        errors {
                          message
                        }
                      }
                    }
                  `, {
                    id: shopId
                  });

                  if (verifyResult?.getSellerByShopIdSeller?.success) {
                    const verifyData = verifyResult.getSellerByShopIdSeller.result;
                    setStatus({
                      isConnected: verifyData.isConnected,
                      merchantName: verifyData.businessName,
                      locations: verifyData.locations
                    });
                    onSuccess?.();
                  }
                } catch (error) {
                  console.error('Failed to handle Square callback:', error);
                  setStatus(prev => ({ 
                    ...prev, 
                    error: 'Failed to connect to Square' 
                  }));
                } finally {
                  window.removeEventListener('message', handleMessage);
                }
              }
            };

            window.addEventListener('message', handleMessage);
          }
        }
      }
    } catch (error) {
      console.error('Failed to initiate Square OAuth:', error);
      setStatus(prev => ({ 
        ...prev, 
        error: 'Failed to start connection process' 
      }));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSquareOAuth = async () => {
    const userId = get("userId");

    if (!userId) {
      throw new Error("User not logged in");
    }

    const result = await api.mutate(`
      mutation SquareOAuth($userId: GadgetID!) {
        squareOAuth(userId: $userId) {
          success
          authUrl
        }
      }
    `, {
      userId: userId
    });

    if (result?.squareOAuth?.success) {
      window.open(result.squareOAuth.authUrl, "_blank");
    }
  };

  return (
    <div className="space-y-4">
      {status.isConnected ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Connected to Square</span>
                </div>
                {status.locations && status.locations.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {status.locations.length} location{status.locations.length !== 1 ? 's' : ''} connected:
                    <ul className="mt-1 list-disc list-inside">
                      {status.locations.map(loc => (
                        <li key={loc.id} className="ml-2">{loc.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSquareOAuth}
                disabled={isConnecting}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button 
          onClick={handleConnect}
          disabled={isConnecting}
          variant={variant}
          size={size}
          className={className}
        >
          <Store className="mr-2 h-4 w-4" />
          {isConnecting ? 'Connecting...' : 'Connect Square'}
        </Button>
      )}
      
      {status.error && (
        <CardDescription className="text-red-500 mt-2">
          {status.error}
        </CardDescription>
      )}
    </div>
  );
} 