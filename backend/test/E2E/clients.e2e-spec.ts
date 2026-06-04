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

describe('Clients (E2E)', () => {
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

  describe('POST /clients', () => {
    it('creates a client and returns clientId', async () => {
      const response = await request(app.getHttpServer())
        .post('/clients')
        .send({ name: 'John Doe', email: 'john@test.com', password: 'password123' })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('clientId')
      expect(typeof response.body.clientId).toBe('string')
    })
  })

  describe('GET /clients', () => {
    it('returns paginated list of clients for ADMIN', async () => {
      const adminToken = await createAdminAndGetToken(prisma, app)
      await createClientAndGetToken(app, 'c1@test.com')
      await createClientAndGetToken(app, 'c2@test.com')

      const response = await request(app.getHttpServer())
        .get('/clients')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.clients).toHaveLength(2)
      expect(response.body.meta).toMatchObject({
        total: 2,
        page: 1,
        totalPages: 1,
      })
    })

    it('respects page and limit query params', async () => {
      const adminToken = await createAdminAndGetToken(prisma, app)
      for (let i = 1; i <= 5; i++) {
        await createClientAndGetToken(app, `client${i}@test.com`)
      }

      const response = await request(app.getHttpServer())
        .get('/clients?page=1&limit=3')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.clients).toHaveLength(3)
      expect(response.body.meta.totalPages).toBe(2)
    })
  })

  describe('PUT /clients/:id', () => {
    it('updates own client data', async () => {
      const { clientId, token } = await createClientAndGetToken(app)

      const response = await request(app.getHttpServer())
        .put(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' })

      expect(response.status).toBe(200)
      expect(response.body.client.name).toBe('Updated Name')
    })

    it('allows ADMIN to update any client', async () => {
      const { clientId } = await createClientAndGetToken(app)
      const adminToken = await createAdminAndGetToken(prisma, app)

      const response = await request(app.getHttpServer())
        .put(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Admin Updated' })

      expect(response.status).toBe(200)
      expect(response.body.client.name).toBe('Admin Updated')
    })
  })

  describe('DELETE /clients/:id', () => {
    it('deletes own account', async () => {
      const { clientId, token } = await createClientAndGetToken(app)

      const response = await request(app.getHttpServer())
        .delete(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(204)
    })

    it('allows ADMIN to delete any client', async () => {
      const { clientId } = await createClientAndGetToken(app)
      const adminToken = await createAdminAndGetToken(prisma, app)

      const response = await request(app.getHttpServer())
        .delete(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(204)
    })
  })
})
