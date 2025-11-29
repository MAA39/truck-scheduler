'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@repo/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card'
import { Badge } from '@repo/ui/badge'
import { TRUCK_STATUS_LABELS, TRUCK_TYPE_LABELS } from '@repo/shared/constants'
import { formatCapacity } from '@repo/shared/utils'
import type { Truck } from '@repo/shared/types'

export default function TrucksPage() {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrucks()
  }, [])

  const fetchTrucks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/trucks`)
      const data = await res.json()
      setTrucks(data.trucks || [])
    } catch (error) {
      console.error('Failed to fetch trucks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'success'
      case 'in_use':
        return 'warning'
      case 'maintenance':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">🚛 トラック管理</h1>
            <p className="text-muted-foreground mt-1">
              車両の登録・状態管理
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">← ホーム</Button>
            </Link>
            <Link href="/trucks/new">
              <Button>+ 新規登録</Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        ) : trucks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                トラックが登録されていません
              </p>
              <Link href="/trucks/new">
                <Button>最初のトラックを登録</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trucks.map((truck) => (
              <Link key={truck.id} href={`/trucks/${truck.id}`}>
                <Card className="hover:bg-accent transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{truck.plateNumber}</CardTitle>
                      <Badge variant={getStatusVariant(truck.status)}>
                        {TRUCK_STATUS_LABELS[truck.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>📦 {TRUCK_TYPE_LABELS[truck.type]}</p>
                      <p>⚖️ {formatCapacity(truck.capacity)}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
