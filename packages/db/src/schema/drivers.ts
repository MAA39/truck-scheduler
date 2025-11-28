import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'

// Enums
export const driverLicenseTypeEnum = pgEnum('driver_license_type', [
  'normal',
  'large',
  'trailer',
])

export const driverStatusEnum = pgEnum('driver_status', [
  'available',
  'on_delivery',
  'off_duty',
])

// Drivers テーブル
export const drivers = pgTable('drivers', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  licenseType: driverLicenseTypeEnum('license_type').notNull().default('normal'),
  status: driverStatusEnum('status').notNull().default('available'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Driver = typeof drivers.$inferSelect
export type NewDriver = typeof drivers.$inferInsert
