import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { PrismaService } from '../../src/infra/database/prisma/prisma.service'
import {
  cleanDatabase,
  createAdminAndGetToken,
  createApp,
  createClientAndGetToken,
} from './setup-e2e'

describe('Services (E2E)', () => {
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

  describe('POST /services', () => {
    it('creates a service (ADMIN only)', async () => {
      const adminToken = await createAdminAndGetToken(prisma, app)

      const response = await request(app.getHttpServer())
        .post('/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Formatação', price: 150 })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('serviceId')
    })
  })

  describe('GET /services', () => {
    it('returns paginated list of services for any authenticated user', async () => {
      const adminToken = await createAdminAndGetToken(prisma, app)
      const { token: clientToken } = await createClientAndGetToken(app)

      await request(app.getHttpServer())
        .post('/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Service A', price: 100 })

      await request(app.getHttpServer())
        .post('/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Service B', price: 200 })

      const response = await request(app.getHttpServer())
        .get('/services')
        .set('Authorization', `Bearer ${clientToken}`)

      expect(response.status).toBe(200)
      expect(response.body.services).toHaveLength(2)
      expect(response.body.meta.total).toBe(2)
    })
  })

  describe('PUT /services/:id', () => {
    it('updates a service (ADMIN only)', async () => {
      const adminToken = await createAdminAndGetToken(prisma, app)

      const { body: { serviceId } } = await request(app.getHttpServer())
        .post('/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Original', price: 100 })

      const response = await request(app.getHttpServer())
        .put(`/services/${serviceId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Service', price: 200 })

      expect(response.status).toBe(200)
      expect(response.body.service.name).toBe('Updated Service')
      expect(response.body.service.price).toBe(200)
    })
  })

  describe('PATCH /services/:id/deactivate', () => {
    it('deactivates a service (ADMIN only)', async () => {
      const adminToken = await createAdminAndGetToken(prisma, app)

      const { body: { serviceId } } = await request(app.getHttpServer())
        .post('/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Active Service', price: 100 })

      const response = await request(app.getHttpServer())
        .patch(`/services/${serviceId}/deactivate`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(204)

      const service = await prisma.service.findUnique({ where: { id: serviceId } })
      expect(service?.deletedAt).not.toBeNull()
    })
  })
})
