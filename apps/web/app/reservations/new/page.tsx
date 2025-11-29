'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@repo/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card'
import { Input } from '@repo/ui/input'
import { Label } from '@repo/ui/label'
import { TIME_SLOT_LABELS } from '@repo/shared/constants'
import type { Driver, Truck, TimeSlot } from '@repo/shared/types'

export default function NewReservationPage() {
  const router = useRouter()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [driverId, setDriverId] = useState('')
  const [truckId, setTruckId] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('morning')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDriversAndTrucks()
  }, [])

  const fetchDriversAndTrucks = async () => {
    try {
      const [driversRes, trucksRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/drivers`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/trucks`),
      ])
      const driversData = await driversRes.json()
      const trucksData = await trucksRes.json()
      setDrivers(driversData.drivers || [])
      setTrucks(trucksData.trucks || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId,
          truckId,
          pickupLocation,
          deliveryLocation,
          scheduledDate,
          timeSlot,
          notes: notes || undefined,
        }),
      })

      if (!res.ok) throw new Error('登録に失敗しました')

      router.push('/reservations')
      router.refresh()
    } catch (err) {
      setError('登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const availableDrivers = drivers.filter((d) => d.status === 'available')
  const availableTrucks = trucks.filter((t) => t.status === 'available')

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">📅 新規予約</h1>
          <Link href="/reservations">
            <Button variant="outline">← 一覧に戻る</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>予約情報</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="driverId">ドライバー *</Label>
                  <select
                    id="driverId"
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">選択してください</option>
                    {availableDrivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                  {availableDrivers.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      利用可能なドライバーがいません
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="truckId">トラック *</Label>
                  <select
                    id="truckId"
                    value={truckId}
                    onChange={(e) => setTruckId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">選択してください</option>
                    {availableTrucks.map((truck) => (
                      <option key={truck.id} value={truck.id}>
                        {truck.plateNumber}
                      </option>
                    ))}
                  </select>
                  {availableTrucks.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      利用可能なトラックがありません
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupLocation">集荷場所 *</Label>
                <Input
                  id="pickupLocation"
                  type="text"
                  placeholder="東京都港区..."
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryLocation">配送先 *</Label>
                <Input
                  id="deliveryLocation"
                  type="text"
                  placeholder="神奈川県横浜市..."
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">予定日 *</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeSlot">時間帯 *</Label>
                  <select
                    id="timeSlot"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    {Object.entries(TIME_SLOT_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">備考</Label>
                <textarea
                  id="notes"
                  placeholder="特記事項があれば入力してください"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? '登録中...' : '予約する'}
                </Button>
                <Link href="/reservations" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    キャンセル
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
