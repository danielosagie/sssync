import React, { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Checkbox } from "./ui/checkbox"
import { ScrollArea } from "./ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Check, ChevronsUpDown, GripVertical, CheckSquare } from 'lucide-react'
import Image from 'next/image'
import { cn } from "../lib/utils";

type ProductVariant = {
  id: string
  title: string
  price: number
  weight: number
  sku: string
}

type Product = {
  id: string
  name: string
  sku: string
  image: string
  price: number
  quantity: number
  weight: number
  variants: ProductVariant[]
}

type SquareLocation = {
  id: string
  name: string
}

type MatchedProduct = {
  squareProduct: Product
  shopifyProduct: Product | null
}

type Column = {
  id: string
  name: string
}

const initialColumns: Column[] = [
  { id: 'image', name: 'Image' },
  { id: 'name', name: 'Name' },
  { id: 'sku', name: 'SKU' },
  { id: 'price', name: 'Price' },
  { id: 'quantity', name: 'Quantity' },
  { id: 'weight', name: 'Weight' },
  { id: 'actions', name: 'Actions' },
]

export function ProductMatching() {
  const [squareLocations, setSquareLocations] = useState<SquareLocation[]>([])
  const [matchedProducts, setMatchedProducts] = useState<{ [locationId: string]: MatchedProduct[] }>({})
  const [shopifyProducts, setShopifyProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [shopifySearchTerm, setShopifySearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState<{ [locationId: string]: number }>({})
  const [activeTab, setActiveTab] = useState("")
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(initialColumns.map(col => col.id))
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        // Simulating API calls with setTimeout
        await new Promise(resolve => setTimeout(resolve, 1000))

        const squareLocationsData: SquareLocation[] = [
          { id: 'loc1', name: 'Main Store' },
          { id: 'loc2', name: 'Branch Store' },
        ]
        setSquareLocations(squareLocationsData)
        setActiveTab(squareLocationsData[0].id)

        const shopifyProductsData: Product[] = Array.from({ length: 50 }, (_, i) => ({
          id: `sp${i + 1}`,
          name: `Shopify Product ${i + 1}`,
          sku: `SKU${String(i + 1).padStart(3, '0')}`,
          image: `/placeholder.svg?height=200&width=200`,
          price: Math.round(Math.random() * 100) + 0.99,
          quantity: Math.floor(Math.random() * 200),
          weight: Math.round((Math.random() * 2 + 0.1) * 10) / 10,
          variants: [
            { id: `v${i + 1}a`, title: 'Small', price: Math.round(Math.random() * 100) + 0.99, weight: Math.round((Math.random() * 0.5 + 0.1) * 10) / 10, sku: `SKU${String(i + 1).padStart(3, '0')}-S` },
            { id: `v${i + 1}b`, title: 'Medium', price: Math.round(Math.random() * 100) + 0.99, weight: Math.round((Math.random() * 0.5 + 0.3) * 10) / 10, sku: `SKU${String(i + 1).padStart(3, '0')}-M` },
            { id: `v${i + 1}c`, title: 'Large', price: Math.round(Math.random() * 100) + 0.99, weight: Math.round((Math.random() * 0.5 + 0.5) * 10) / 10, sku: `SKU${String(i + 1).padStart(3, '0')}-L` },
          ]
        }))
        setShopifyProducts(shopifyProductsData)

        const squareProductsData: { [locationId: string]: Product[] } = {
          'loc1': Array.from({ length: 25 }, (_, i) => ({
            id: `sq${i + 1}`,
            name: `Square Product ${i + 1}`,
            sku: `SKU${String(i + 1).padStart(3, '0')}`,
            image: '/placeholder.svg?height=200&width=200',
            price: Math.round(Math.random() * 100) + 0.99,
            quantity: Math.floor(Math.random() * 200),
            weight: Math.round((Math.random() * 2 + 0.1) * 10) / 10,
            variants: []
          })),
          'loc2': Array.from({ length: 15 }, (_, i) => ({
            id: `sq${i + 26}`,
            name: `Square Product ${i + 26}`,
            sku: `SKU${String(i + 26).padStart(3, '0')}`,
            image: '/placeholder.svg?height=200&width=200',
            price: Math.round(Math.random() * 100) + 0.99,
            quantity: Math.floor(Math.random() * 200),
            weight: Math.round((Math.random() * 2 + 0.1) * 10) / 10,
            variants: []
          })),
        }

        const initialMatchedProducts: { [locationId: string]: MatchedProduct[] } = {}
        const initialCurrentPage: { [locationId: string]: number } = {}
        squareLocationsData.forEach(location => {
          initialMatchedProducts[location.id] = squareProductsData[location.id].map(squareProduct => ({
            squareProduct,
            shopifyProduct: shopifyProductsData.find(sp => sp.sku === squareProduct.sku) || null
          }))
          initialCurrentPage[location.id] = 1
        })
        setMatchedProducts(initialMatchedProducts)
        setCurrentPage(initialCurrentPage)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('An error occurred while fetching data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleMatch = (locationId: string, squareProductId: string, shopifyProductId: string) => {
    setMatchedProducts(prev => ({
      ...prev,
      [locationId]: prev[locationId]?.map(match => 
        match.squareProduct.id === squareProductId
          ? { ...match, shopifyProduct: shopifyProducts.find(sp => sp.id === shopifyProductId) || null }
          : match
      ) ?? []
    }))
  }

  const filteredProducts = (locationId: string) => {
    return matchedProducts[locationId]?.filter(match =>
      match.squareProduct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.squareProduct.sku.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? []
  }

  const paginatedProducts = (locationId: string) => {
    const filtered = filteredProducts(locationId)
    const startIndex = ((currentPage[locationId] ?? 1) - 1) * itemsPerPage
    return filtered.slice(startIndex, startIndex + itemsPerPage)
  }

  const totalPages = (locationId: string) => Math.ceil(filteredProducts(locationId).length / itemsPerPage)

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const newColumns = Array.from(columns)
    const [reorderedItem] = newColumns.splice(result.source.index, 1)
    newColumns.splice(result.destination.index, 0, reorderedItem)

    setColumns(newColumns)
  }

  const toggleColumnVisibility = (columnId: string) => {
    setVisibleColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    )
  }

  const filteredShopifyProducts = shopifyProducts.filter(product =>
    product.name.toLowerCase().includes(shopifySearchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(shopifySearchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <Card className="my-8">
        <CardHeader>
          <CardTitle>Product Matching</CardTitle>
          <CardDescription>Loading product data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="my-8">
        <CardHeader>
          <CardTitle>Product Matching</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>Product Matching</CardTitle>
        <CardDescription>Match Square products with Shopify products for each location</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {squareLocations.map(location => (
              <TabsTrigger key={location.id} value={location.id}>
                {location.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {squareLocations.map(location => (
            <TabsContent key={location.id} value={location.id}>
              <div className="space-y-4">
                <div className="flex justify-between mb-4">
                  <Input
                    placeholder="Filter inventory transactions..."
                    className="max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <CheckSquare className="mr-2 h-4 w-4" />
                        Columns
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px]">
                      {columns.map(column => (
                        <div key={column.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={column.id}
                            checked={visibleColumns.includes(column.id)}
                            onCheckedChange={() => toggleColumnVisibility(column.id)}
                          />
                          <Label htmlFor={column.id}>{column.name}</Label>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Table>
                    <Droppable droppableId="columns" direction="horizontal">
                      {(provided) => (
                        <TableHeader ref={provided.innerRef} {...provided.droppableProps}>
                          <TableRow>
                            {visibleColumns.map((columnId, index) => {
                              const column = columns.find(col => col.id === columnId)
                              if (!column) return null
                              return (
                                <Draggable key={column.id} draggableId={column.id} index={index}>
                                  {(provided) => (
                                    <TableHead ref={provided.innerRef} {...provided.draggableProps}>
                                      <div className="flex items-center">
                                        <span {...provided.dragHandleProps}>
                                          <GripVertical className="mr-2 h-4 w-4" />
                                        </span>
                                        {column.name}
                                      </div>
                                    </TableHead>
                                  )}
                                </Draggable>
                              )
                            })}
                            {provided.placeholder}
                          </TableRow>
                        </TableHeader>
                      )}
                    </Droppable>
                    <TableBody>
                      {paginatedProducts(location.id).map((match) => (
                        <TableRow key={match.squareProduct.id} className="h-24">
                          {visibleColumns.map((columnId) => (
                            <TableCell key={columnId} className="py-4">
                              {columnId === 'image' && (
                                <Image
                                  src={match.squareProduct.image}
                                  alt={match.squareProduct.name}
                                  width={60}
                                  height={60}
                                  className="rounded-md"
                                />
                              )}
                              {columnId === 'name' && (
                                <div className="font-medium">{match.squareProduct.name}</div>
                              )}
                              {columnId === 'sku' && (
                                <div className="text-sm text-muted-foreground">{match.squareProduct.sku}</div>
                              )}
                              {columnId === 'price' && (
                                <div>${match.squareProduct.price.toFixed(2)}</div>
                              )}
                              {columnId === 'quantity' && (
                                <div>{match.squareProduct.quantity}</div>
                              )}
                              {columnId === 'weight' && (
                                <div>{match.squareProduct.weight} kg</div>
                              )}
                              {columnId === 'actions' && (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[200px] justify-start">
                                      {match.shopifyProduct ? (
                                        <>
                                          <Check className="mr-2 h-4 w-4" />
                                          {match.shopifyProduct.name}
                                        </>
                                      ) : (
                                        <>
                                          <ChevronsUpDown className="mr-2 h-4 w-4" />
                                          Select Shopify Product
                                        </>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                      <CommandInput 
                                        placeholder="Search Shopify products..." 
                                        value={shopifySearchTerm}
                                        onValueChange={setShopifySearchTerm}
                                      />
                                      <CommandEmpty>No Shopify product found.</CommandEmpty>
                                      <CommandGroup>
                                        <ScrollArea className="h-72">
                                          {filteredShopifyProducts.map((product) => (
                                            <CommandItem
                                              key={product.id}
                                              onSelect={() => {
                                                handleMatch(location.id, match.squareProduct.id, product.id)
                                                setShopifySearchTerm('')
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  match.shopifyProduct?.id === product.id ? "opacity-100" : "opacity-0"
                                                )}
                                              />
                                              {product.name}
                                            </CommandItem>
                                          ))}
                                        </ScrollArea>
                                      </CommandGroup>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </DragDropContext>
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Showing {paginatedProducts(location.id).length} of {filteredProducts(location.id).length} products
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => setItemsPerPage(Number(value))}
                    >
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={itemsPerPage} />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                          <SelectItem key={pageSize} value={pageSize.toString()}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {currentPage[location.id] ?? 1} of {totalPages(location.id)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => ({ ...prev, [location.id]: Math.max((prev[location.id] ?? 1) - 1, 1) }))}
                      disabled={(currentPage[location.id] ?? 1) === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => ({ ...prev, [location.id]: Math.min((prev[location.id] ?? 1) + 1, totalPages(location.id)) }))}
                      disabled={(currentPage[location.id] ?? 1) === totalPages(location.id)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}