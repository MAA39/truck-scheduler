'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@repo/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card'
import { Input } from '@repo/ui/input'
import { Label } from '@repo/ui/label'
import { LICENSE_TYPE_LABELS, DRIVER_STATUS_LABELS } from '@repo/shared/constants'
import type { Driver, DriverLicenseType, DriverStatus } from '@repo/shared/types'

export default function DriverDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [driver, setDriver] = useState<Driver | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [licenseType, setLicenseType] = useState<DriverLicenseType>('normal')
  const [status, setStatus] = useState<DriverStatus>('available')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDriver()
  }, [id])

  const fetchDriver = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/drivers/${id}`)
      if (!res.ok) throw new Error('Not found')
      const data = await res.json()
      setDriver(data.driver)
      setName(data.driver.name)
      setPhone(data.driver.phone)
      setLicenseType(data.driver.licenseType)
      setStatus(data.driver.status)
    } catch (error) {
      setError('ドライバーが見つかりません')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/drivers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, licenseType, status }),
      })

      if (!res.ok) throw new Error('更新に失敗しました')

      router.push('/drivers')
      router.refresh()
    } catch (err) {
      setError('更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('このドライバーを削除しますか？')) return

    setDeleting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/drivers/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('削除に失敗しました')

      router.push('/drivers')
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

  if (!driver) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">{error || 'ドライバーが見つかりません'}</p>
          <Link href="/drivers">
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
          <h1 className="text-3xl font-bold">👷 ドライバー編集</h1>
          <Link href="/drivers">
            <Button variant="outline">← 一覧に戻る</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ドライバー情報</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">氏名 *</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">電話番号 *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseType">免許種別 *</Label>
                <select
                  id="licenseType"
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value as DriverLicenseType)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  {Object.entries(LICENSE_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">ステータス *</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as DriverStatus)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  {Object.entries(DRIVER_STATUS_LABELS).map(([value, label]) => (
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
