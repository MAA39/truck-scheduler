# 🚚 Truck Scheduler

運送業務向けトラック・ドライバー予約管理システム

## Tech Stack

- **Monorepo**: Turborepo + pnpm
- **Frontend**: Next.js 15 (App Router)
- **API**: Hono
- **UI**: Shadcn/ui + Tailwind CSS
- **DB**: Supabase (PostgreSQL) + Drizzle ORM
- **Auth**: Better Auth

## Project Structure

```
truck-scheduler/
├── apps/
│   ├── web/           # Next.js フロントエンド
│   └── api/           # Hono API サーバー
├── packages/
│   ├── ui/            # Shadcn/ui コンポーネント
│   ├── shared/        # 共通型定義・ユーティリティ
│   ├── db/            # Drizzle ORM スキーマ・クライアント
│   ├── auth/          # Better Auth 設定
│   └── typescript-config/  # TSConfig 設定
├── turbo.json
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Supabase プロジェクト

### Installation

```bash
# リポジトリをクローン
git clone https://github.com/MAA39/truck-scheduler.git
cd truck-scheduler

# 依存関係をインストール
pnpm install

# 環境変数を設定
cp .env.example .env
# .env を編集して Supabase の接続情報を設定

# DBマイグレーション（初回）
pnpm --filter @repo/db db:push

# 開発サーバーを起動
pnpm dev
```

### Environment Variables

```bash
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3001

# Web
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Development

```bash
# 全アプリを並列起動
pnpm dev

# Web のみ起動 (http://localhost:3000)
pnpm --filter @repo/web dev

# API のみ起動 (http://localhost:3001)
pnpm --filter @repo/api dev

# Drizzle Studio（DBブラウザ）
pnpm --filter @repo/db db:studio
```

### Build

```bash
pnpm build
```

### Type Check

```bash
pnpm check-types
```

## Features

- 👷 **ドライバー管理** - ドライバーの登録・編集・ステータス管理
- 🚛 **トラック管理** - 車両の登録・状態管理
- 📅 **配送予約** - 日時指定・時間帯別予約管理
- 🔐 **認証** - メール/パスワード認証（Better Auth）
- 📊 **ダッシュボード** - 統計・スケジュール一覧 (*Coming soon*)

## Roadmap

- [x] Phase 1: プロジェクト基盤セットアップ
- [x] Phase 2: DB・認証（Supabase + Better Auth）
- [ ] Phase 3: 基本CRUD実装
- [ ] Phase 4: 予約機能実装
- [ ] Phase 5: ダッシュボード・最適化

## License

MIT
