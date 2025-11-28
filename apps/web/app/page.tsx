'use client'

import Link from 'next/link'
import { useSession, signOut } from '@repo/auth/client'
import { Button } from '@repo/ui/button'

export default function Home() {
  const { data: session, isPending } = useSession()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          🚚 Truck Scheduler
        </h1>
        <p className="text-xl text-muted-foreground">
          配送予約管理システム
        </p>

        {/* 認証状態 */}
        <div className="mt-4">
          {isPending ? (
            <p className="text-muted-foreground">読み込み中...</p>
          ) : session?.user ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                ようこそ、<span className="font-medium text-foreground">{session.user.name}</span> さん
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
              >
                ログアウト
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 justify-center">
              <Link href="/login">
                <Button variant="default">ログイン</Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline">新規登録</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="grid gap-4 mt-8 sm:grid-cols-3">
          <Link
            href="/drivers"
            className="p-6 border rounded-lg hover:bg-accent transition-colors"
          >
            <h2 className="text-lg font-semibold">👷 ドライバー管理</h2>
            <p className="text-sm text-muted-foreground mt-2">
              ドライバーの登録・編集
            </p>
          </Link>

          <Link
            href="/trucks"
            className="p-6 border rounded-lg hover:bg-accent transition-colors"
          >
            <h2 className="text-lg font-semibold">🚛 トラック管理</h2>
            <p className="text-sm text-muted-foreground mt-2">
              車両の登録・状態管理
            </p>
          </Link>

          <Link
            href="/reservations"
            className="p-6 border rounded-lg hover:bg-accent transition-colors"
          >
            <h2 className="text-lg font-semibold">📅 配送予約</h2>
            <p className="text-sm text-muted-foreground mt-2">
              配送スケジュール管理
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}
