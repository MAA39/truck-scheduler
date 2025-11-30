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

## Pages

| ページ | パス | 機能 |
|-------|------|------|
| ホーム | `/` | 認証状態表示・ナビゲーション |
| ログイン | `/login` | メール/パスワードログイン |
| 新規登録 | `/signup` | アカウント作成 |
| ドライバー一覧 | `/drivers` | ドライバー一覧・ステータス表示 |
| ドライバー登録 | `/drivers/new` | 新規ドライバー登録 |
| ドライバー編集 | `/drivers/[id]` | ドライバー情報編集・削除 |
| トラック一覧 | `/trucks` | トラック一覧・ステータス表示 |
| トラック登録 | `/trucks/new` | 新規トラック登録 |
| トラック編集 | `/trucks/[id]` | トラック情報編集・削除 |
| 予約一覧 | `/reservations` | 配送予約一覧 |
| 予約作成 | `/reservations/new` | 新規予約作成 |
| 予約編集 | `/reservations/[id]` | 予約情報編集・削除 |

## API Endpoints

| Method | Endpoint | 機能 |
|--------|----------|------|
| GET | `/api/drivers` | ドライバー一覧取得 |
| POST | `/api/drivers` | ドライバー作成 |
| GET | `/api/drivers/:id` | ドライバー詳細取得 |
| PUT | `/api/drivers/:id` | ドライバー更新 |
| DELETE | `/api/drivers/:id` | ドライバー削除 |
| GET | `/api/trucks` | トラック一覧取得 |
| POST | `/api/trucks` | トラック作成 |
| GET | `/api/trucks/:id` | トラック詳細取得 |
| PUT | `/api/trucks/:id` | トラック更新 |
| DELETE | `/api/trucks/:id` | トラック削除 |
| GET | `/api/reservations` | 予約一覧取得 |
| POST | `/api/reservations` | 予約作成 |
| GET | `/api/reservations/:id` | 予約詳細取得 |
| PUT | `/api/reservations/:id` | 予約更新 |
| DELETE | `/api/reservations/:id` | 予約削除 |
| POST/GET | `/api/auth/**` | Better Auth認証 |

## Roadmap

- [x] Phase 1: プロジェクト基盤セットアップ
- [x] Phase 2: DB・認証（Supabase + Better Auth）
- [x] Phase 3: 基本CRUD実装
- [ ] Phase 4: 高度な予約機能（カレンダービュー・フィルタリング）
- [ ] Phase 5: ダッシュボード・最適化

## License

MIT
