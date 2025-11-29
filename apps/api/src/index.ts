import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { eq } from 'drizzle-orm'
import { auth } from '@repo/auth'
import { db } from '@repo/db/client'
import { drivers, trucks, reservations } from '@repo/db/schema'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
)

// Health check
app.get('/', (c) => {
  return c.json({
    message: '🚚 Truck Scheduler API',
    version: '0.1.0',
    status: 'running',
  })
})

// Better Auth handler
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  return auth.handler(c.req.raw)
})

// API Routes
const api = new Hono()

// ========== Drivers ==========
api.get('/drivers', async (c) => {
  try {
    const result = await db.select().from(drivers).orderBy(drivers.createdAt)
    return c.json({ drivers: result })
  } catch (error) {
    console.error('Failed to fetch drivers:', error)
    return c.json({ error: 'Failed to fetch drivers' }, 500)
  }
})

api.post('/drivers', async (c) => {
  try {
    const body = await c.req.json()
    const [driver] = await db.insert(drivers).values({
      name: body.name,
      phone: body.phone,
      licenseType: body.licenseType,
    }).returning()
    return c.json({ driver }, 201)
  } catch (error) {
    console.error('Failed to create driver:', error)
    return c.json({ error: 'Failed to create driver' }, 500)
  }
})

api.get('/drivers/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const [driver] = await db.select().from(drivers).where(eq(drivers.id, id))
    if (!driver) {
      return c.json({ error: 'Driver not found' }, 404)
    }
    return c.json({ driver })
  } catch (error) {
    console.error('Failed to fetch driver:', error)
    return c.json({ error: 'Failed to fetch driver' }, 500)
  }
})

api.put('/drivers/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const [driver] = await db.update(drivers)
      .set({
        name: body.name,
        phone: body.phone,
        licenseType: body.licenseType,
        status: body.status,
        updatedAt: new Date(),
      })
      .where(eq(drivers.id, id))
      .returning()
    if (!driver) {
      return c.json({ error: 'Driver not found' }, 404)
    }
    return c.json({ driver })
  } catch (error) {
    console.error('Failed to update driver:', error)
    return c.json({ error: 'Failed to update driver' }, 500)
  }
})

api.delete('/drivers/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const [driver] = await db.delete(drivers).where(eq(drivers.id, id)).returning()
    if (!driver) {
      return c.json({ error: 'Driver not found' }, 404)
    }
    return c.json({ message: 'Driver deleted' })
  } catch (error) {
    console.error('Failed to delete driver:', error)
    return c.json({ error: 'Failed to delete driver' }, 500)
  }
})

// ========== Trucks ==========
api.get('/trucks', async (c) => {
  try {
    const result = await db.select().from(trucks).orderBy(trucks.createdAt)
    return c.json({ trucks: result })
  } catch (error) {
    console.error('Failed to fetch trucks:', error)
    return c.json({ error: 'Failed to fetch trucks' }, 500)
  }
})

api.post('/trucks', async (c) => {
  try {
    const body = await c.req.json()
    const [truck] = await db.insert(trucks).values({
      plateNumber: body.plateNumber,
      capacity: body.capacity,
      type: body.type,
    }).returning()
    return c.json({ truck }, 201)
  } catch (error) {
    console.error('Failed to create truck:', error)
    return c.json({ error: 'Failed to create truck' }, 500)
  }
})

api.get('/trucks/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const [truck] = await db.select().from(trucks).where(eq(trucks.id, id))
    if (!truck) {
      return c.json({ error: 'Truck not found' }, 404)
    }
    return c.json({ truck })
  } catch (error) {
    console.error('Failed to fetch truck:', error)
    return c.json({ error: 'Failed to fetch truck' }, 500)
  }
})

api.put('/trucks/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const [truck] = await db.update(trucks)
      .set({
        plateNumber: body.plateNumber,
        capacity: body.capacity,
        type: body.type,
        status: body.status,
        updatedAt: new Date(),
      })
      .where(eq(trucks.id, id))
      .returning()
    if (!truck) {
      return c.json({ error: 'Truck not found' }, 404)
    }
    return c.json({ truck })
  } catch (error) {
    console.error('Failed to update truck:', error)
    return c.json({ error: 'Failed to update truck' }, 500)
  }
})

api.delete('/trucks/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const [truck] = await db.delete(trucks).where(eq(trucks.id, id)).returning()
    if (!truck) {
      return c.json({ error: 'Truck not found' }, 404)
    }
    return c.json({ message: 'Truck deleted' })
  } catch (error) {
    console.error('Failed to delete truck:', error)
    return c.json({ error: 'Failed to delete truck' }, 500)
  }
})

// ========== Reservations ==========
api.get('/reservations', async (c) => {
  try {
    const result = await db.select().from(reservations).orderBy(reservations.scheduledDate)
    return c.json({ reservations: result })
  } catch (error) {
    console.error('Failed to fetch reservations:', error)
    return c.json({ error: 'Failed to fetch reservations' }, 500)
  }
})

api.post('/reservations', async (c) => {
  try {
    const body = await c.req.json()
    const [reservation] = await db.insert(reservations).values({
      driverId: body.driverId,
      truckId: body.truckId,
      pickupLocation: body.pickupLocation,
      deliveryLocation: body.deliveryLocation,
      scheduledDate: body.scheduledDate,
      timeSlot: body.timeSlot,
      notes: body.notes,
    }).returning()
    return c.json({ reservation }, 201)
  } catch (error) {
    console.error('Failed to create reservation:', error)
    return c.json({ error: 'Failed to create reservation' }, 500)
  }
})

api.get('/reservations/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const [reservation] = await db.select().from(reservations).where(eq(reservations.id, id))
    if (!reservation) {
      return c.json({ error: 'Reservation not found' }, 404)
    }
    return c.json({ reservation })
  } catch (error) {
    console.error('Failed to fetch reservation:', error)
    return c.json({ error: 'Failed to fetch reservation' }, 500)
  }
})

api.put('/reservations/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const [reservation] = await db.update(reservations)
      .set({
        driverId: body.driverId,
        truckId: body.truckId,
        pickupLocation: body.pickupLocation,
        deliveryLocation: body.deliveryLocation,
        scheduledDate: body.scheduledDate,
        timeSlot: body.timeSlot,
        status: body.status,
        notes: body.notes,
        updatedAt: new Date(),
      })
      .where(eq(reservations.id, id))
      .returning()
    if (!reservation) {
      return c.json({ error: 'Reservation not found' }, 404)
    }
    return c.json({ reservation })
  } catch (error) {
    console.error('Failed to update reservation:', error)
    return c.json({ error: 'Failed to update reservation' }, 500)
  }
})

api.delete('/reservations/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const [reservation] = await db.delete(reservations).where(eq(reservations.id, id)).returning()
    if (!reservation) {
      return c.json({ error: 'Reservation not found' }, 404)
    }
    return c.json({ message: 'Reservation deleted' })
  } catch (error) {
    console.error('Failed to delete reservation:', error)
    return c.json({ error: 'Failed to delete reservation' }, 500)
  }
})

// Mount API routes
app.route('/api', api)

const port = 3001
console.log(`🚚 Truck Scheduler API running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})

export default app
