import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import type { Driver, Truck, Reservation } from '@repo/shared/types'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors())

// Health check
app.get('/', (c) => {
  return c.json({
    message: '🚚 Truck Scheduler API',
    version: '0.0.1',
    status: 'running',
  })
})

// API Routes
const api = new Hono()

// Drivers
api.get('/drivers', (c) => {
  // TODO: Implement with DB
  return c.json({ drivers: [], message: 'Get all drivers' })
})

api.post('/drivers', async (c) => {
  const body = await c.req.json()
  return c.json({ driver: body, message: 'Create driver' })
})

api.get('/drivers/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id, message: 'Get driver by id' })
})

api.put('/drivers/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  return c.json({ id, driver: body, message: 'Update driver' })
})

api.delete('/drivers/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id, message: 'Delete driver' })
})

// Trucks
api.get('/trucks', (c) => {
  return c.json({ trucks: [], message: 'Get all trucks' })
})

api.post('/trucks', async (c) => {
  const body = await c.req.json()
  return c.json({ truck: body, message: 'Create truck' })
})

api.get('/trucks/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id, message: 'Get truck by id' })
})

api.put('/trucks/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  return c.json({ id, truck: body, message: 'Update truck' })
})

api.delete('/trucks/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id, message: 'Delete truck' })
})

// Reservations
api.get('/reservations', (c) => {
  return c.json({ reservations: [], message: 'Get all reservations' })
})

api.post('/reservations', async (c) => {
  const body = await c.req.json()
  return c.json({ reservation: body, message: 'Create reservation' })
})

api.get('/reservations/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id, message: 'Get reservation by id' })
})

api.put('/reservations/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  return c.json({ id, reservation: body, message: 'Update reservation' })
})

api.delete('/reservations/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id, message: 'Delete reservation' })
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
