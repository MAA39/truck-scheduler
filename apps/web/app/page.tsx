import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          🚚 Truck Scheduler
        </h1>
        <p className="text-xl text-muted-foreground">
          配送予約管理システム
        </p>

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
