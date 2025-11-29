'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@repo/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card'
import { Badge } from '@repo/ui/badge'
import { RESERVATION_STATUS_LABELS, TIME_SLOT_LABELS } from '@repo/shared/constants'
import { formatDate } from '@repo/shared/utils'
import type { Reservation } from '@repo/shared/types'

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/reservations`)
      const data = await res.json()
      setReservations(data.reservations || [])
    } catch (error) {
      console.error('Failed to fetch reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary'
      case 'confirmed':
        return 'default'
      case 'in_progress':
        return 'warning'
      case 'completed':
        return 'success'
      case 'cancelled':
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
            <h1 className="text-3xl font-bold">📅 配送予約</h1>
            <p className="text-muted-foreground mt-1">
              配送スケジュールの管理
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">← ホーム</Button>
            </Link>
            <Link href="/reservations/new">
              <Button>+ 新規予約</Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        ) : reservations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                配送予約がありません
              </p>
              <Link href="/reservations/new">
                <Button>最初の予約を作成</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <Link key={reservation.id} href={`/reservations/${reservation.id}`}>
                <Card className="hover:bg-accent transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {formatDate(reservation.scheduledDate)} {TIME_SLOT_LABELS[reservation.timeSlot]}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {reservation.pickupLocation} → {reservation.deliveryLocation}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(reservation.status)}>
                        {RESERVATION_STATUS_LABELS[reservation.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>👷 ドライバーID: {reservation.driverId}</span>
                      <span>🚛 トラックID: {reservation.truckId}</span>
                    </div>
                    {reservation.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        📝 {reservation.notes}
                      </p>
                    )}
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
