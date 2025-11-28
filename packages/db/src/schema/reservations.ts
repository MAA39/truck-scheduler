import { pgTable, text, timestamp, date, pgEnum } from 'drizzle-orm/pg-core'
import { drivers } from './drivers'
import { trucks } from './trucks'

// Enums
export const timeSlotEnum = pgEnum('time_slot', ['morning', 'afternoon', 'evening'])

export const reservationStatusEnum = pgEnum('reservation_status', [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
])

// Reservations テーブル
export const reservations = pgTable('reservations', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  driverId: text('driver_id')
    .notNull()
    .references(() => drivers.id, { onDelete: 'restrict' }),
  truckId: text('truck_id')
    .notNull()
    .references(() => trucks.id, { onDelete: 'restrict' }),
  pickupLocation: text('pickup_location').notNull(), // 集荷場所
  deliveryLocation: text('delivery_location').notNull(), // 配送先
  scheduledDate: date('scheduled_date').notNull(), // 予定日
  timeSlot: timeSlotEnum('time_slot').notNull(), // 時間帯
  status: reservationStatusEnum('status').notNull().default('pending'),
  notes: text('notes'), // 備考
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Reservation = typeof reservations.$inferSelect
export type NewReservation = typeof reservations.$inferInsert
