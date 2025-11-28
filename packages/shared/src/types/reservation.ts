// Reservation（配送予約）
export type TimeSlot = 'morning' | 'afternoon' | 'evening'
export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export type Reservation = {
  id: string
  driverId: string
  truckId: string
  pickupLocation: string // 集荷場所
  deliveryLocation: string // 配送先
  scheduledDate: Date // 予定日
  timeSlot: TimeSlot // 時間帯
  status: ReservationStatus
  notes?: string // 備考
  createdAt: Date
  updatedAt: Date
}

export type CreateReservationInput = Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateReservationInput = Partial<CreateReservationInput>
