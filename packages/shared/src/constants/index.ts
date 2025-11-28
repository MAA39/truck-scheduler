// 時間帯の表示ラベル
export const TIME_SLOT_LABELS = {
  morning: '午前（8:00-12:00）',
  afternoon: '午後（12:00-17:00）',
  evening: '夜間（17:00-21:00）',
} as const

// ドライバーステータスの表示ラベル
export const DRIVER_STATUS_LABELS = {
  available: '待機中',
  on_delivery: '配送中',
  off_duty: '休憩中',
} as const

// トラックステータスの表示ラベル
export const TRUCK_STATUS_LABELS = {
  available: '利用可能',
  in_use: '使用中',
  maintenance: 'メンテナンス中',
} as const

// 予約ステータスの表示ラベル
export const RESERVATION_STATUS_LABELS = {
  pending: '保留中',
  confirmed: '確定',
  in_progress: '配送中',
  completed: '完了',
  cancelled: 'キャンセル',
} as const

// 免許種別の表示ラベル
export const LICENSE_TYPE_LABELS = {
  normal: '普通免許',
  large: '大型免許',
  trailer: 'けん引免許',
} as const

// トラックタイプの表示ラベル
export const TRUCK_TYPE_LABELS = {
  small: '小型（2t以下）',
  medium: '中型（4t）',
  large: '大型（10t）',
} as const
