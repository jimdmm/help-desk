import { type INestApplication } from '@nestjs/common'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { PrismaService } from '../../src/infra/database/prisma/prisma.service'
import {
  cleanDatabase,
  createAdminAndGetToken,
  createApp,
  createClientAndGetToken,
  createTechnicianAndGetToken,
} from './setup-e2e'

describe('Authentication (E2E)', () => {
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

  it('POST /sessions → authenticates a client and returns access_token', async () => {
    const { token } = await createClientAndGetToken(app)

    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3) // valid JWT format
  })

  it('POST /sessions → authenticates a technician and returns access_token', async () => {
    const { token } = await createTechnicianAndGetToken(prisma, app)

    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
  })

  it('POST /sessions → authenticates an admin and returns access_token', async () => {
    const token = await createAdminAndGetToken(prisma, app)

    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
  })

  it('POST /sessions → returns 401 for wrong password', async () => {
    await createClientAndGetToken(app)

    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({ email: 'client@test.com', password: 'wrong-password' })

    expect(response.status).toBe(401)
  })
})
