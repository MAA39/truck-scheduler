'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@repo/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card'
import { Input } from '@repo/ui/input'
import { Label } from '@repo/ui/label'
import { TRUCK_TYPE_LABELS, TRUCK_STATUS_LABELS } from '@repo/shared/constants'
import type { Truck, TruckType, TruckStatus } from '@repo/shared/types'

export default function TruckDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [truck, setTruck] = useState<Truck | null>(null)
  const [plateNumber, setPlateNumber] = useState('')
  const [capacity, setCapacity] = useState('')
  const [type, setType] = useState<TruckType>('medium')
  const [status, setStatus] = useState<TruckStatus>('available')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTruck()
  }, [id])

  const fetchTruck = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/trucks/${id}`)
      if (!res.ok) throw new Error('Not found')
      const data = await res.json()
      setTruck(data.truck)
      setPlateNumber(data.truck.plateNumber)
      setCapacity(String(data.truck.capacity))
      setType(data.truck.type)
      setStatus(data.truck.status)
    } catch (error) {
      setError('トラックが見つかりません')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/trucks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plateNumber,
          capacity: parseInt(capacity, 10),
          type,
          status,
        }),
      })

      if (!res.ok) throw new Error('更新に失敗しました')

      router.push('/trucks')
      router.refresh()
    } catch (err) {
      setError('更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('このトラックを削除しますか？')) return

    setDeleting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/trucks/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('削除に失敗しました')

      router.push('/trucks')
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

  if (!truck) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">{error || 'トラックが見つかりません'}</p>
          <Link href="/trucks">
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
          <h1 className="text-3xl font-bold">🚛 トラック編集</h1>
          <Link href="/trucks">
            <Button variant="outline">← 一覧に戻る</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>トラック情報</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="plateNumber">ナンバープレート *</Label>
                <Input
                  id="plateNumber"
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">積載量 (kg) *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">車両タイプ *</Label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as TruckType)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  {Object.entries(TRUCK_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">ステータス *</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TruckStatus)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  {Object.entries(TRUCK_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
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
