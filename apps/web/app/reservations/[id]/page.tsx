'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@repo/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card'
import { Input } from '@repo/ui/input'
import { Label } from '@repo/ui/label'
import { TIME_SLOT_LABELS, RESERVATION_STATUS_LABELS } from '@repo/shared/constants'
import type { Reservation, Driver, Truck, TimeSlot, ReservationStatus } from '@repo/shared/types'

export default function ReservationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [driverId, setDriverId] = useState('')
  const [truckId, setTruckId] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('morning')
  const [status, setStatus] = useState<ReservationStatus>('pending')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [reservationRes, driversRes, trucksRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/reservations/${id}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/drivers`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/trucks`),
      ])

      if (!reservationRes.ok) throw new Error('Not found')

      const reservationData = await reservationRes.json()
      const driversData = await driversRes.json()
      const trucksData = await trucksRes.json()

      setReservation(reservationData.reservation)
      setDrivers(driversData.drivers || [])
      setTrucks(trucksData.trucks || [])

      const r = reservationData.reservation
      setDriverId(r.driverId)
      setTruckId(r.truckId)
      setPickupLocation(r.pickupLocation)
      setDeliveryLocation(r.deliveryLocation)
      setScheduledDate(r.scheduledDate)
      setTimeSlot(r.timeSlot)
      setStatus(r.status)
      setNotes(r.notes || '')
    } catch (error) {
      setError('予約が見つかりません')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId,
          truckId,
          pickupLocation,
          deliveryLocation,
          scheduledDate,
          timeSlot,
          status,
          notes: notes || undefined,
        }),
      })

      if (!res.ok) throw new Error('更新に失敗しました')

      router.push('/reservations')
      router.refresh()
    } catch (err) {
      setError('更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('この予約を削除しますか？')) return

    setDeleting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/reservations/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('削除に失敗しました')

      router.push('/reservations')
      router.refresh()
    } catch (err) {
      setError('削除に失敗しました')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">{error || '予約が見つかりません'}</p>
          <Link href="/reservations">
            <Button>一覧に戻る</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">📅 予約編集</h1>
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
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
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
                    {trucks.map((truck) => (
                      <option key={truck.id} value={truck.id}>
                        {truck.plateNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">ステータス *</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ReservationStatus)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  {Object.entries(RESERVATION_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupLocation">集荷場所 *</Label>
                <Input
                  id="pickupLocation"
                  type="text"
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
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">備考</Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? '保存中...' : '保存する'}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? '削除中...' : '削除'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
