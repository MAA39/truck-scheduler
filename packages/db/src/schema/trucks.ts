import { pgTable, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core'

// Enums
export const truckTypeEnum = pgEnum('truck_type', ['small', 'medium', 'large'])

export const truckStatusEnum = pgEnum('truck_status', [
  'available',
  'in_use',
  'maintenance',
])

// Trucks テーブル
export const trucks = pgTable('trucks', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  plateNumber: text('plate_number').notNull().unique(), // ナンバープレート
  capacity: integer('capacity').notNull(), // 積載量(kg)
  type: truckTypeEnum('type').notNull().default('medium'),
  status: truckStatusEnum('status').notNull().default('available'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Truck = typeof trucks.$inferSelect
export type NewTruck = typeof trucks.$inferInsert
