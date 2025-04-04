'use client'

import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { ScrollArea } from "./ui/scroll-area"
import { ArrowRight, ArrowLeft, Check, Store, MapPin, Settings, FileCheck, X, Plus, Trash2, Edit2, ShoppingBag, Zap, RefreshCcw, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from "../lib/utils"
import SyncConfiguration from './SyncConfiguration'
import { api } from '../api';
import { AuthContext } from '../providers';



const steps = [
  { id: 'welcome', title: 'Welcome', icon: Store },
  { id: 'square', title: 'Square Connection', icon: ShoppingBag },
  { id: 'location', title: 'Location Setup', icon: MapPin },
  { id: 'sync', title: 'Sync Settings', icon: Settings },
  { id: 'review', title: 'Review & Finish', icon: FileCheck },
]

export function OnboardingFlow({
  isOnboardingOpen,
  setIsOnboardingOpen,
  onComplete,
  children,
}: {
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (isOnboardingOpen: boolean) => void;
  onComplete?: () => void;
  children?: React.ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSquareConnected, setIsSquareConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      storeName: '',
      squareStores: [],
      locations: [],
      syncSettings: []
    }
  })
  const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({
    control,
    name: "locations"
  })
  const { fields: syncSettingsFields, append: appendSyncSetting, remove: removeSyncSetting } = useFieldArray({
    control,
    name: "syncSettings"
  })

  const { user } = useContext(AuthContext);

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (isSquareConnected) {
      fetchLocations();
    }
  }, [isSquareConnected]);

  const fetchLocations = async () => {
    try {
      const result = await api.mutate(`
        mutation UpdateLocations($id: GadgetID!) {
          updateLocations(id: $id) {
            success
            errors {
              message
            }
          }
        }
      `, { id: user.id });

      if (result.updateLocations?.success) {
        const locationsResult = await api.query(`
          query GetLocations($sellerId: GadgetID!) {
            locations(filter: { seller: { equals: $sellerId } }) {
              nodes {
                id
                businessName
                name
                squareLocationId
              }
            }
          }
        `, { sellerId: user.id });

        setLocations(locationsResult.data.locations.nodes);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    // Check URL params for connection status
    const params = new URLSearchParams(location.search);
    const connected = params.get('square_connected');
    
    if (connected === 'true') {
      setIsSquareConnected(true);
      setIsOnboardingOpen(false);
      if (onComplete) onComplete();
    } else if (connected === 'false') {
      setError("Failed to connect Square account");
    }
  }, [location.search]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'square-auth-success') {
        setIsSquareConnected(true);
        fetchLocations(); // Fetch locations after successful connection
        if (onComplete) onComplete();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectSquare = () => {
    startSquareOAuth();
  };

  const startSquareOAuth = async () => {
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
        const authUrl = result.squareOAuth.result.result.authUrl;
        if (authUrl) {
          // Open in new tab to maintain original tab state
          window.open(authUrl, '_blank');
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

  // Add useEffect to handle callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (code) {
      handleOAuthCallback(code);
    } else if (error) {
      setError(error === 'access_denied' ? 'Authorization denied by user' : 'Authorization failed');
    }
  }, [location.search]);

  const handleOAuthCallback = async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.mutate(`
        mutation HandleSquareCallback($code: String!) {
          handleSquareCallback(code: $code) {
            success
            errors {
              message
            }
            result {
              accessToken
              refreshToken
              merchantId
              expiresAt
            }
          }
        }
      `, { code });

      if (result.handleSquareCallback?.success) {
        const { accessToken, refreshToken, merchantId, expiresAt } = result.handleSquareCallback.result;
        
        // Update seller with the new tokens
        await api.mutate(`
          mutation UpdateSeller($Seller: UpdateSellerInput!, $id: GadgetID!) {
            updateSeller(Seller: $Seller, id: $id) {
              success
              errors {
                message
              }
              Seller {
                id
                isConnected
                squareAccessToken
                squareRefreshToken
                squareTokenExpiresAt
                squareMerchantId
              }
            }
          }
        `, {
          Seller: {
            squareAccessToken: accessToken,
            squareRefreshToken: refreshToken,
            squareTokenExpiresAt: expiresAt,
            squareMerchantId: merchantId,
            isConnected: true
          },
          id: user.id
        });

        setIsSquareConnected(true);
        if (onComplete) onComplete();
      } else {
        setError(result.handleSquareCallback?.errors?.[0]?.message || "Unknown error");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data) => {
    console.log('Onboarding completed:', data)
    setIsOnboardingOpen(false)
    // Here you would typically send the data to your backend
  }

  const navigateStep = (direction) => {
    const newStep = currentStep + direction
    if (newStep >= 0 && newStep < steps.length) {
      setCurrentStep(newStep)
    }
  }

  const handleRename = (location) => {
    const newName = prompt('Enter new name', location.businessName);
    if (newName) {
      // Implement the logic to update the location name
    }
  };

  const handleDelete = (id) => {
    // Implement the logic to delete the location
  };

  return (
    <>
      <Button onClick={() => setIsOnboardingOpen(true)}>Start Onboarding</Button>
      <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
        <DialogContent className="max-w-5xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 border-b">
            <DialogTitle className="text-2xl font-bold text-primary">Square Shopify Sync Setup</DialogTitle>
            <DialogDescription>Complete the following steps to set up your integration</DialogDescription>
          </DialogHeader>
          <div className="flex flex-1 overflow-hidden">
            <div className="w-1/4 border-r p-4">
              <nav aria-label="Progress">
                <ol role="list">
                  {steps.map((step, stepIdx) => (
                    <li key={step.title} className={cn(stepIdx !== steps.length - 1 ? "pb-10" : "", "relative")}>
                      <div className={cn(
                        stepIdx !== steps.length - 1 ? "-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full" : "",
                        stepIdx < currentStep ? "bg-primary" : "bg-gray-300"
                      )} aria-hidden="true" />
                      <button
                        className="relative flex items-start group"
                        onClick={() => setCurrentStep(stepIdx)}
                        aria-current={stepIdx === currentStep ? "step" : undefined}
                      >
                        <span className="h-9 flex items-center" aria-hidden="true">
                          <span className={cn(
                            "relative z-10 w-8 h-8 flex items-center justify-center rounded-full",
                            stepIdx < currentStep ? "bg-primary" : 
                            stepIdx === currentStep ? "bg-white border-2 border-primary" : 
                            "bg-white border-2 border-gray-300"
                          )}>
                            {stepIdx < currentStep ? (
                              <Check className="w-5 h-5 text-white" />
                            ) : stepIdx === currentStep ? (
                              <span className="h-2.5 w-2.5 bg-primary rounded-full" />
                            ) : (
                              <span className="h-2.5 w-2.5 bg-transparent rounded-full" />
                            )}
                          </span>
                        </span>
                        <span className="ml-4 min-w-0 flex flex-col">
                          <span className={cn(
                            "text-sm font-medium",
                            stepIdx <= currentStep ? "text-primary" : "text-gray-500"
                          )}>
                            {step.title}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
            <ScrollArea className="flex-1 p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {currentStep === 0 && <WelcomeStep register={register} />}
                {currentStep === 1 && <SquareConnectionStep register={register} control={control} watch={watch} isSquareConnected={isSquareConnected} setIsSquareConnected={setIsSquareConnected} handleConnectSquare={handleConnectSquare} isConnecting={isLoading} />}
                {currentStep === 2 && (
                  <LocationSetupStep
                    register={register}
                    control={control}
                    fields={locationFields}
                    append={appendLocation}
                    remove={removeLocation}
                    watch={watch}
                  />
                )}
                {currentStep === 3 && <SyncSettingsStep control={control} fields={locationFields} />}
                {currentStep === 4 && <ReviewStep watch={watch} />}
                
                <div className="flex justify-between mt-8">
                  <Button type="button" onClick={() => navigateStep(-1)} variant="outline" disabled={currentStep === 0}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  {currentStep < steps.length - 1 ? (
                    <Button type="button" onClick={() => navigateStep(1)}>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit">
                      Finish
                      <Check className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </form>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function WelcomeStep({ register }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Welcome to Square Shopify Sync</h2>
      <p>Let's get your store set up. This process will take about 5-10 minutes.</p>
      <div className="space-y-2">
        <Label htmlFor="storeName">Store Name (Optional)</Label>
        <Input id="storeName" {...register("storeName")} placeholder="Enter your store name" />
      </div>
      <ul className="list-none space-y-2">
        <li className="flex items-center"><ShoppingBag className="w-5 h-5 mr-2" /> Connect your Square account</li>
        <li className="flex items-center"><MapPin className="w-5 h-5 mr-2" /> Set up your store locations</li>
        <li className="flex items-center"><Settings className="w-5 h-5 mr-2" /> Configure your sync settings</li>
        <li className="flex items-center"><FileCheck className="w-5 h-5 mr-2" /> Review and finish</li>
      </ul>
    </div>
  )
}

function SquareConnectionStep({
  register,
  control,
  watch,
  isSquareConnected,
  setIsSquareConnected,
  handleConnectSquare,
  isConnecting
}: {
  register: any;
  control: any;
  watch: any;
  isSquareConnected: boolean;
  setIsSquareConnected: (connected: boolean) => void;
  handleConnectSquare: () => void;
  isConnecting: boolean;
}) {
  const { fields: squareStores, append: appendSquareStore, remove: removeSquareStore, update: updateSquareStore } = useFieldArray({
    control,
    name: "squareStores"
  })

  const handleRename = (index, currentName) => {
    const newName = prompt('Enter new name', currentName)
    if (newName) {
      updateSquareStore(index, { name: newName })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connect Your Square Account</CardTitle>
          <CardDescription>Link your Square stores to get started.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full p-right-2 p-left-2" 
            onClick={handleConnectSquare} 
            disabled={isConnecting || isSquareConnected}
          >
            {isConnecting ? (
              <>
                <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : isSquareConnected ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Connected
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Connect Square Store
              </>
            )}
          </Button>
          {squareStores.map((store, index) => (
            <div key={store.id} className="flex items-center justify-between p-2 border rounded">
              <span>{store.name}</span>
              <div>
                <Button variant="ghost" size="sm" onClick={() => handleRename(index, store.name)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeSquareStore(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {squareStores.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-500"><AlertCircle className="w-5 h-5 inline mr-2" />Action Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You need to connect at least one Square store to proceed.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function LocationSetupStep({ register, control, fields, append, remove, watch }) {
  const squareStores = watch('squareStores')
  const [shopifyLocations, setShopifyLocations] = useState([
    { id: 'shop1', name: 'Main Shopify Store' },
    { id: 'shop2', name: 'Shopify Warehouse' }
  ])

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  useEffect(() => {
    // Ensure there's at least one mapping if we have both Square and Shopify locations
    if (fields.length === 0 && squareStores.length > 0 && shopifyLocations.length > 0) {
      append({ square: squareStores[0].id, shopify: shopifyLocations[0].id, color: getRandomColor() })
    }
  }, [squareStores, shopifyLocations, fields, append, getRandomColor]) // Added getRandomColor to dependencies

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Set Up Your Locations</h2>
      <p>Map your Square locations to your Shopify locations.</p>
      
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg flex items-center">
              <div 
                className="w-6 h-6 rounded-full mr-2" 
                style={{ backgroundColor: field.color || getRandomColor() }}
              />
              Location Mapping {index + 1}
            </CardTitle>
            <Button type="button" variant="ghost" onClick={() => remove(index)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Square Location</Label>
                <Select {...register(`locations.${index}.square`)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Square location" />
                  </SelectTrigger>
                  <SelectContent>
                    {squareStores.map(store => (
                      <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Shopify Location</Label>
                <Select {...register(`locations.${index}.shopify`)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Shopify location" />
                  </SelectTrigger>
                  <SelectContent>
                    {shopifyLocations.map(location => (
                      <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button type="button" variant="outline" className="w-full" onClick={() => append({ square: '', shopify: '', color: getRandomColor() })}>
        <Plus className="w-4 h-4 mr-2" />
        Add Location Mapping
      </Button>
    </div>
  )
}

function SyncSettingsStep({ control, fields }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Configure Sync Settings</h2>
      <p>Choose how you want to sync your products for each location mapping.</p>
      
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader>
            <CardTitle>Sync Settings for Mapping {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <SyncConfiguration 
              control={control} 
              index={index}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ReviewStep({ watch }) {
  const formData = watch()

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review Your Settings</h2>
      <p>Please review your settings before finishing the setup.</p>
      
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Store Name:</strong> {formData.storeName || 'Not provided'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Square Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            {formData.squareStores.map((store, index) => (
              <li key={index}>{store.name}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location Mappings</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            {formData.locations.map((location, index) => (
              <li key={index} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: location.color }}
                />
                {location.square} (Square) ↔ {location.shopify} (Shopify)
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sync Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.locations.map((location, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-semibold">Mapping {index + 1}</h4>
              <p><strong>Square Location:</strong> {location.square}</p>
              <p><strong>Shopify Location:</strong> {location.shopify}</p>
              <p><strong>Sync Direction:</strong> {formData.syncSettings[index]?.syncDirection}</p>
              <p><strong>Fields to Sync:</strong></p>
              <ul className="list-disc list-inside">
                {Object.entries(formData.syncSettings[index]?.syncFields || {}).map(([field, value]) => (
                  value && <li key={field}>{field}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <p>After completing this setup:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Your Square and Shopify accounts will be connected</li>
            <li>Initial sync will begin based on your configuration</li>
            <li>You can modify these settings at any time from the dashboard</li>
            <li>Our support team is available if you need any assistance</li>
          </ul>
        </CardContent>
      </Card>

      {isSquareConnected && (
        <div className="space-y-2">
          {locations.map((location) => (
            <div key={location.id} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{location.businessName} - {location.name}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleRename(location)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(location.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OnboardingFlow