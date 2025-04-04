import React, { useState } from 'react'
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Checkbox } from "./ui/checkbox"
import { CalendarIcon, DownloadIcon, CheckSquareIcon, GripVertical } from 'lucide-react'
import { format } from 'date-fns'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

export function DashboardComponent() {
  const [dateRange, setDateRange] = useState("13 June 2023 - Present")
  const [syncMethod, setSyncMethod] = useState("Latest Order Syncs to Other (Auto)")
  const [searchQuery, setSearchQuery] = useState("")
  const [columns, setColumns] = useState([
    { id: 'title', name: 'Title' },
    { id: 'quantity', name: 'Quantity' },
    { id: 'platform', name: 'Platform' },
    { id: 'date', name: 'Date' },
    { id: 'actions', name: 'Actions' },
  ])

  const unresolved_transactions = [
    { id: 1, title: "Product Title", quantity: 2, platform: "Square", date: new Date() },
    { id: 2, title: "Product Title", quantity: 2, platform: "Square", date: new Date(Date.now() - 86400000) },
    { id: 3, title: "Product Title", quantity: 2, platform: "Square", date: new Date(Date.now() - 172800000) },
    { id: 4, title: "Product Title", quantity: 2, platform: "Shopify", date: new Date(Date.now() - 259200000) },
    { id: 5, title: "Product Title", quantity: 2, platform: "Shopify", date: new Date(Date.now() - 345600000) },
  ]

  const recent_transactions = [
    { id: 1, title: "Product Title", variant: "Variant Name", quantity: 2, platform: "Square" },
    { id: 2, title: "Product Title", variant: "Variant Name", quantity: 7, platform: "Square" },
    { id: 3, title: "Product Title", variant: "Variant Name", quantity: 2, platform: "Shopify" },
    { id: 4, title: "Product Title", variant: "Variant Name", quantity: 1, platform: "Square" },
    { id: 5, title: "Product Title", variant: "Variant Name", quantity: 5, platform: "Shopify" },
  ]

  const formatDate = (date: Date) => {
    const today = new Date()
    if (date.toDateString() === today.toDateString()) {
      return format(date, 'h:mm a')
    }
    return format(date, 'MMM d, yyyy')
  }

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    const newColumns = Array.from(columns)
    const [reorderedItem] = newColumns.splice(result.source.index, 1)
    newColumns.splice(result.destination.index, 0, reorderedItem)

    setColumns(newColumns)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange}
          </Button>
          <Button>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download Transaction Data
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Unresolved Sync Transactions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Settle any inventory mismatches below and how you want them to be handled going forward
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <Input
                placeholder="Filter inventory transactions..."
                className="max-w-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select defaultValue="columns">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Columns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="columns">
                    <div className="flex items-center">
                      <CheckSquareIcon className="mr-2 h-4 w-4" />
                      Columns
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Table>
                <Droppable droppableId="columns" direction="horizontal">
                  {(provided) => (
                    <TableHeader ref={provided.innerRef} {...provided.droppableProps}>
                      <TableRow>
                        <TableHead className="w-[40px]"><Checkbox /></TableHead>
                        {columns.map((column, index) => (
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
                        ))}
                        {provided.placeholder}
                      </TableRow>
                    </TableHeader>
                  )}
                </Droppable>
                <TableBody>
                  {unresolved_transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell><Checkbox /></TableCell>
                      {columns.map((column) => (
                        <TableCell key={column.id}>
                          {column.id === 'title' && transaction.title}
                          {column.id === 'quantity' && `${transaction.quantity} Items`}
                          {column.id === 'platform' && transaction.platform}
                          {column.id === 'date' && formatDate(transaction.date)}
                          {column.id === 'actions' && (
                            <>
                              <Button variant="outline" size="sm" className="mr-2">
                                Use {transaction.platform} →
                              </Button>
                              <Button variant="outline" size="sm">
                                ← Use {transaction.platform === "Square" ? "Shopify" : "Square"}
                              </Button>
                            </>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DragDropContext>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center">
                <Label htmlFor="show-rows" className="mr-2">Show</Label>
                <Select defaultValue="5">
                  <SelectTrigger id="show-rows" className="w-[70px]">
                    <SelectValue placeholder="5" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
                <span className="ml-2">rows</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Set Default Sync Method</CardTitle>
              <p className="text-sm text-muted-foreground">
                Which way should your products default to
              </p>
            </CardHeader>
            <CardContent>
              <Select value={syncMethod} onValueChange={setSyncMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Latest Order Syncs to Other (Auto)">Latest Order Syncs to Other (Auto)</SelectItem>
                  <SelectItem value="Always Use Square">Always Use Square</SelectItem>
                  <SelectItem value="Always Use Shopify">Always Use Shopify</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <p className="text-sm text-muted-foreground">
                You made 265 transactions this month.
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recent_transactions.map((transaction) => (
                  <li key={transaction.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <p className="font-medium">{transaction.title}</p>
                      <p className="text-sm text-muted-foreground">{transaction.variant}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p>{transaction.quantity} Items on {transaction.platform}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}