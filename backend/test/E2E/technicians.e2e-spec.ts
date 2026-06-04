import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { PrismaService } from '../../src/infra/database/prisma/prisma.service'
import {
  cleanDatabase,
  createAdminAndGetToken,
  createApp,
  createTechnicianAndGetToken,
} from './setup-e2e'

describe('Technicians (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    ;({ app, prisma } = await createApp())
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await cleanDatabase(prisma)
  })

  describe('POST /technicians', () => {
    it('creates a technician (ADMIN only)', async () => {
      const adminToken = await createAdminAndGetToken(prisma, app)

      const response = await request(app.getHttpServer())
        .post('/technicians')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Tech One',
          email: 'tech1@test.com',
          password: 'password123',
          availability: ['08:00', '09:00', '10:00'],
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('technicianId')
    })

    it('applies default availability when not provided', async () => {
      const adminToken = await createAdminAndGetToken(prisma, app)

      const response = await request(app.getHttpServer())
        .post('/technicians')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Tech Two', email: 'tech2@test.com', password: 'password123' })

      expect(response.status).toBe(201)

      const tech = await prisma.technician.findUnique({
        where: { email: 'tech2@test.com' },
      })
      expect(tech?.availability).toHaveLength(8)
    })
  })

  describe('GET /technicians', () => {
    it('returns paginated list of technicians', async () => {
      const adminToken = await createAdminAndGetToken(prisma, app)
      await createTechnicianAndGetToken(prisma, app, 't1@test.com')
      await createTechnicianAndGetToken(prisma, app, 't2@test.com')

      const response = await request(app.getHttpServer())
        .get('/technicians')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.technicians).toHaveLength(2)
      expect(response.body.meta.total).toBe(2)
    })
  })

  describe('PUT /technicians/:id', () => {
    it('allows ADMIN to update any technician', async () => {
      const adminToken = await createAdminAndGetToken(prisma, app)
      const { technicianId } = await createTechnicianAndGetToken(prisma, app)

      const response = await request(app.getHttpServer())
        .put(`/technicians/${technicianId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Tech Name', availability: ['08:00', '09:00'] })

      expect(response.status).toBe(200)
      expect(response.body.technician.name).toBe('Updated Tech Name')
      expect(response.body.technician.availability).toEqual(['08:00', '09:00'])
    })

    it('allows technician to update own profile', async () => {
      const { technicianId, token } = await createTechnicianAndGetToken(prisma, app)

      const response = await request(app.getHttpServer())
        .put(`/technicians/${technicianId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Self Updated' })

      expect(response.status).toBe(200)
      expect(response.body.technician.name).toBe('Self Updated')
    })
  })

  describe('DELETE /technicians/:id', () => {
    it('allows ADMIN to delete a technician', async () => {
      const adminToken = await createAdminAndGetToken(prisma, app)
      const { technicianId } = await createTechnicianAndGetToken(prisma, app)

      const response = await request(app.getHttpServer())
        .delete(`/technicians/${technicianId}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(204)
    })
  })
})
