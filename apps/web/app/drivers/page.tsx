'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@repo/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card'
import { Badge } from '@repo/ui/badge'
import { DRIVER_STATUS_LABELS, LICENSE_TYPE_LABELS } from '@repo/shared/constants'
import type { Driver } from '@repo/shared/types'

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDrivers()
  }, [])

  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/drivers`)
      const data = await res.json()
      setDrivers(data.drivers || [])
    } catch (error) {
      console.error('Failed to fetch drivers:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'success'
      case 'on_delivery':
        return 'warning'
      case 'off_duty':
        return 'secondary'
      default:
        return 'default'
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">👷 ドライバー管理</h1>
            <p className="text-muted-foreground mt-1">
              ドライバーの登録・編集・ステータス管理
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">← ホーム</Button>
            </Link>
            <Link href="/drivers/new">
              <Button>+ 新規登録</Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        ) : drivers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                ドライバーが登録されていません
              </p>
              <Link href="/drivers/new">
                <Button>最初のドライバーを登録</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {drivers.map((driver) => (
              <Link key={driver.id} href={`/drivers/${driver.id}`}>
                <Card className="hover:bg-accent transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{driver.name}</CardTitle>
                      <Badge variant={getStatusVariant(driver.status)}>
                        {DRIVER_STATUS_LABELS[driver.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>📞 {driver.phone}</p>
                      <p>🪪 {LICENSE_TYPE_LABELS[driver.licenseType]}</p>
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
