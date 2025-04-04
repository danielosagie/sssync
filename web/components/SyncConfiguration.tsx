'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Switch } from "./ui/switch"
import { ArrowLeftRight, ArrowRight, ArrowLeft } from 'lucide-react'

const initialSyncFields = {
  title: { enabled: true, direction: 'bidirectional' },
  description: { enabled: true, direction: 'bidirectional' },
  price: { enabled: true, direction: 'to_shopify' },
  inventory: { enabled: true, direction: 'bidirectional' },
  images: { enabled: false, direction: 'to_square' },
  variants: { enabled: true, direction: 'bidirectional' },
  categories: { enabled: true, direction: 'to_shopify' },
}

export default function SyncConfiguration() {
  const [syncFields, setSyncFields] = useState(initialSyncFields)

  const handleDirectionChange = (field: string, direction: string) => {
    setSyncFields(prev => ({
      ...prev,
      [field]: { ...prev[field], direction }
    }))
  }

  const handleEnableChange = (field: string, enabled: boolean) => {
    setSyncFields(prev => ({
      ...prev,
      [field]: { ...prev[field], enabled }
    }))
  }

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'bidirectional':
        return <ArrowLeftRight className="h-4 w-4" />
      case 'to_shopify':
        return <ArrowLeft className="h-4 w-4" />
      case 'to_square':
        return <ArrowRight className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configure Field Sync</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 items-center mb-4 font-medium">
          <div>Field</div>
          <div className="text-center">Shopify</div>
          <div className="text-center">Direction</div>
          <div className="text-center">Square</div>
        </div>
        
        <div className="space-y-4">
          {Object.entries(syncFields).map(([field, config]) => (
            <div key={field} className="grid grid-cols-4 gap-4 items-center py-2 border-t">
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(checked) => handleEnableChange(field, checked)}
                  className="mr-2"
                />
                <span className="capitalize">{field}</span>
              </div>
              
              <div className="flex justify-center">
                <div className={`w-3 h-3 rounded-full ${
                  config.enabled && (config.direction === 'bidirectional' || config.direction === 'to_shopify')
                    ? 'bg-primary'
                    : 'bg-muted'
                }`} />
              </div>

              <div className="flex justify-center">
                <Select
                  value={config.direction}
                  onValueChange={(value) => handleDirectionChange(field, value)}
                  disabled={!config.enabled}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {getDirectionIcon(config.direction)}
                        <span className="capitalize">
                          {config.direction === 'bidirectional' ? 'Both Ways' :
                           config.direction === 'to_shopify' ? 'To Shopify' :
                           'To Square'}
                        </span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bidirectional">
                      <div className="flex items-center gap-2">
                        <ArrowLeftRight className="h-4 w-4" />
                        Both Ways
                      </div>
                    </SelectItem>
                    <SelectItem value="to_shopify">
                      <div className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        To Shopify
                      </div>
                    </SelectItem>
                    <SelectItem value="to_square">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        To Square
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <div className={`w-3 h-3 rounded-full ${
                  config.enabled && (config.direction === 'bidirectional' || config.direction === 'to_square')
                    ? 'bg-primary'
                    : 'bg-muted'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}