import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "../components/ui/button"
import { Checkbox } from "../components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Separator } from "../components/ui/separator"
import { Switch } from "../components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { toast } from "../hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { AlertCircle, ArrowRightLeft, Check, ChevronDown, Edit, Plus, RefreshCcw, Settings, Store, Trash2, Undo } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Label } from "../components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { ProductMatching } from "./components-product-matching"
import Image from "next/image"

const integrationFormSchema = z.object({
  squareStores: z.array(z.string()).min(1, "At least one Square store must be selected"),
  shopifyLocations: z.array(z.string()).min(1, "At least one Shopify location must be selected"),
  syncFields: z.object({
    title: z.enum(["bidirectional", "to_square", "to_shopify", "disabled"]),
    description: z.enum(["bidirectional", "to_square", "to_shopify", "disabled"]),
    price: z.enum(["bidirectional", "to_square", "to_shopify", "disabled"]),
    inventory: z.enum(["bidirectional", "to_square", "to_shopify", "disabled"]),
    images: z.enum(["bidirectional", "to_square", "to_shopify", "disabled"]),
    categories: z.enum(["bidirectional", "to_square", "to_shopify", "disabled"]),
  }),
})

const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  notificationTypes: z.object({
    syncErrors: z.boolean(),
    lowInventory: z.boolean(),
    newOrders: z.boolean(),
  }),
})

type IntegrationFormValues = z.infer<typeof integrationFormSchema>
type NotificationFormValues = z.infer<typeof notificationFormSchema>

type Store = {
  id: string
  name: string
  type: 'square' | 'shopify'
  status: 'active' | 'disabled'
  mapping?: string
}

export function SettingsPageComponent() {
  const [activeTab, setActiveTab] = useState("integration")
  const [stores, setStores] = useState<Store[]>([
    { id: 'sq1', name: 'Main Square Store', type: 'square', status: 'active', mapping: 'sh1' },
    { id: 'sh1', name: 'Shopify Online Store', type: 'shopify', status: 'active', mapping: 'sq1' },
    { id: 'sq2', name: 'Square Branch Store', type: 'square', status: 'disabled' },
  ])
  const [squareLocations, setSquareLocations] = useState([
    { id: 'sql1', name: 'Main Location' },
    { id: 'sql2', name: 'Branch Location' },
  ])
  const [shopifyLocations, setShopifyLocations] = useState([
    { id: 'shl1', name: 'Online Store' },
    { id: 'shl2', name: 'Physical Store' },
  ])

  const integrationForm = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationFormSchema),
    defaultValues: {
      squareStores: [],
      shopifyLocations: [],
      syncFields: {
        title: "bidirectional",
        description: "bidirectional",
        price: "bidirectional",
        inventory: "bidirectional",
        images: "bidirectional",
        categories: "bidirectional",
      },
    },
  })

  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: false,
      notificationTypes: {
        syncErrors: true,
        lowInventory: true,
        newOrders: false,
      },
    },
  })

  function onIntegrationSubmit(data: IntegrationFormValues) {
    toast({
      title: "Integration settings updated",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  function onNotificationSubmit(data: NotificationFormValues) {
    toast({
      title: "Notification preferences updated",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  const addStore = (newStore: Store) => {
    setStores([...stores, newStore])
  }

  const removeStore = (id: string) => {
    setStores(stores.filter(store => store.id !== id))
  }

  const updateStore = (id: string, updates: Partial<Store>) => {
    setStores(stores.map(store => store.id === id ? { ...store, ...updates } : store))
  }

  return (
    <div className="space-y-6 w-full p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <Tabs defaultValue="integration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integration" onClick={() => setActiveTab("integration")}>Integration</TabsTrigger>
          <TabsTrigger value="notifications" onClick={() => setActiveTab("notifications")}>Notifications</TabsTrigger>
          <TabsTrigger value="activity-log" onClick={() => setActiveTab("activity-log")}>Activity Log</TabsTrigger>
          <TabsTrigger value="product-matching" onClick={() => setActiveTab("product-matching")}>Product Matching</TabsTrigger>
        </TabsList>
        <TabsContent value="integration" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IntegrationCard
              title="Square Integration"
              description="Manage your Square store connections"
              connectionStatus="Connected"
              icon={<Store className="h-6 w-6" />}
              locations={squareLocations}
              onAddLocation={(name) => setSquareLocations([...squareLocations, { id: `sql${Date.now()}`, name }])}
              onRemoveLocation={(id) => setSquareLocations(squareLocations.filter(loc => loc.id !== id))}
            />
            <IntegrationCard
              title="Shopify Integration"
              description="Manage your Shopify store connections"
              connectionStatus="Connected"
              icon={<Store className="h-6 w-6" />}
              locations={shopifyLocations}
              onAddLocation={(name) => setShopifyLocations([...shopifyLocations, { id: `shl${Date.now()}`, name }])}
              onRemoveLocation={(id) => setShopifyLocations(shopifyLocations.filter(loc => loc.id !== id))}
            />
          </div>
          <RequestsAndPairCode />
          <MapConnections stores={stores} onAdd={addStore} onRemove={removeStore} onUpdate={updateStore} />
          <IntegrationSettings form={integrationForm} onSubmit={onIntegrationSubmit} />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <NotificationPreferences form={notificationForm} onSubmit={onNotificationSubmit} />
        </TabsContent>
        <TabsContent value="activity-log" className="space-y-4">
          <ActivityLog />
        </TabsContent>
        <TabsContent value="product-matching" className="space-y-4">
          <ProductMatching />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function IntegrationCard({ title, description, connectionStatus, icon, locations, onAddLocation, onRemoveLocation }: {
  title: string;
  description: string;
  connectionStatus: string;
  icon: React.ReactNode;
  locations: { id: string; name: string }[];
  onAddLocation: (name: string) => void;
  onRemoveLocation: (id: string) => void;
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newLocationName, setNewLocationName] = useState('')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Connection Status:</span>
          <Badge variant="default">{connectionStatus}</Badge>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Locations</h4>
          <ul className="space-y-2">
            {locations.map((location) => (
              <li key={location.id} className="flex items-center justify-between">
                <span>{location.name}</span>
                <Button variant="ghost" size="sm" onClick={() => onRemoveLocation(location.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-2">
                <Plus className="h-4 w-4 mr-2" /> Add Location
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Location</DialogTitle>
                <DialogDescription>
                  Enter the name for the new location.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => {
                  onAddLocation(newLocationName)
                  setNewLocationName('')
                  setIsAddDialogOpen(false)
                }}>Add Location</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

function RequestsAndPairCode() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Requests and Pair Code</CardTitle>
        <CardDescription>Manage join requests and pair codes for your integrations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Join Requests</h4>
            <p>No pending join requests</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Pair Code</h4>
            <div className="flex items-center space-x-2">
              <Input value="ABC123" readOnly />
              <Button variant="outline">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Generate New Code
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MapConnections({ stores, onAdd, onRemove, onUpdate }: { stores: Store[]; onAdd: (store: Store) => void; onRemove: (id: string) => void; onUpdate: (id: string, updates: Partial<Store>) => void }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newStore, setNewStore] = useState<Partial<Store>>({ name: '', type: 'square', status: 'active' })

  const handleAddStore = () => {
    if (newStore.name && newStore.type) {
      onAdd({
        id: `${newStore.type}${Date.now()}`,
        name: newStore.name,
        type: newStore.type as 'square' | 'shopify',
        status: newStore.status as 'active' | 'disabled',
      })
      setNewStore({ name: '', type: 'square', status: 'active' })
      setIsAddDialogOpen(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Map Connections</CardTitle>
        <CardDescription>Manage and map your Square and Shopify store connections</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mapping</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.type}</TableCell>
                <TableCell>
                  <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>
                    {store.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StoreMapping
                    store={store}
                    stores={stores}
                    onUpdate={(mapping) => onUpdate(store.id, { mapping })}
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onUpdate(store.id, { status: store.status === 'active' ? 'disabled' : 'active' })}>
                        {store.status === 'active' ? 'Disable' : 'Enable'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        const newName = prompt('Enter new name', store.name)
                        if (newName) onUpdate(store.id, { name: newName })
                      }}>
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onRemove(store.id)}>
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add New Connection
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Store Connection</DialogTitle>
              <DialogDescription>
                Enter the details for the new store connection.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newStore.type}
                  onValueChange={(value) => setNewStore({ ...newStore, type: value as 'square' | 'shopify' })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select store type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="shopify">Shopify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddStore}>Add Store</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

function StoreMapping({ store, stores, onUpdate }: { store: Store; stores: Store[]; onUpdate: (mapping: string) => void }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(store.mapping || "")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? stores.find((s) => s.id === value)?.name || "Select store..."
            : "Select store..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search store..." />
          <CommandEmpty>No store found.</CommandEmpty>
          <CommandGroup>
            {stores
              .filter((s) => s.id !== store.id && s.type !== store.type)
              .map((s) => (
                <CommandItem
                  key={s.id}
                  onSelect={() => {
                    setValue(s.id)
                    onUpdate(s.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === s.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {s.name}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function IntegrationSettings({ form, onSubmit }: { form: any, onSubmit: (data: IntegrationFormValues) => void }) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Sync Configuration</CardTitle>
            <CardDescription>Configure how your data syncs between Square and Shopify</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Sync Direction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(form.watch("syncFields")).map(([field, value]) => (
                  <TableRow key={field}>
                    <TableCell className="font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`syncFields.${field}`}
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select sync direction" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="bidirectional">Bidirectional</SelectItem>
                                <SelectItem value="to_square">To Square</SelectItem>
                                <SelectItem value="to_shopify">To Shopify</SelectItem>
                                <SelectItem value="disabled">Disabled</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button type="submit">Update Integration Settings</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

function NotificationPreferences({ form, onSubmit }: { form: any, onSubmit: (data: NotificationFormValues) => void }) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you want to receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Email Notifications</FormLabel>
                    <FormDescription>
                      Receive notifications via email
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pushNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Push Notifications</FormLabel>
                    <FormDescription>
                      Receive push notifications on your devices
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Types</CardTitle>
            <CardDescription>Select the types of notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="notificationTypes.syncErrors"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Sync Errors</FormLabel>
                    <FormDescription>
                      Receive notifications about sync errors
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notificationTypes.lowInventory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Low Inventory</FormLabel>
                    <FormDescription>
                      Receive notifications about low inventory
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notificationTypes.newOrders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>New Orders</FormLabel>
                    <FormDescription>
                      Receive notifications about new orders
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit">Update Notification Preferences</Button>
      </form>
    </Form>
  )
}

function ActivityLog() {
  const [activityLogs] = useState([
    { id: 1, action: "Updated product price", timestamp: "2023-06-24 15:30:00", user: "John Doe" },
    { id: 2, action: "Added new product", timestamp: "2023-06-23 09:15:00", user: "Jane Smith" },
    { id: 3, action: "Synced inventory", timestamp: "2023-06-22 14:45:00", user: "System" },
  ])

  const handleUndo = (id: number) => {
    toast({
      title: "Action undone",
      description: `Undid action with ID ${id}`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Recent changes and actions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Undo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activityLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleUndo(log.id)}>
                    <Undo className="h-4 w-4 mr-2" />
                    Undo
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}