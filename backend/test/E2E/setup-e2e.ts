import { type INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { PrismaService } from '../../src/infra/database/prisma/prisma.service'

export async function createApp(): Promise<{
  app: INestApplication
  prisma: PrismaService
}> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  const app = moduleRef.createNestApplication()
  await app.init()

  const prisma = moduleRef.get(PrismaService)

  return { app, prisma }
}

export async function cleanDatabase(prisma: PrismaService): Promise<void> {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE tickets, ticket_services, services, technicians, clients, admins RESTART IDENTITY CASCADE',
  )
}

export async function createAdminAndGetToken(
  prisma: PrismaService,
  app: INestApplication,
): Promise<string> {
  await prisma.admin.create({
    data: {
      name: 'Admin Test',
      email: 'admin@test.com',
      password: await hash('admin123', 8),
    },
  })

  const response = await request(app.getHttpServer())
    .post('/sessions')
    .send({ email: 'admin@test.com', password: 'admin123' })

  return response.body.access_token as string
}

export async function createClientAndGetToken(
  app: INestApplication,
  email = 'client@test.com',
  password = 'password123',
): Promise<{ clientId: string; token: string }> {
  const createRes = await request(app.getHttpServer())
    .post('/clients')
    .send({ name: 'Client Test', email, password })

  const clientId = createRes.body.clientId as string

  const loginRes = await request(app.getHttpServer())
    .post('/sessions')
    .send({ email, password })

  return { clientId, token: loginRes.body.access_token as string }
}

export async function createTechnicianAndGetToken(
  prisma: PrismaService,
  app: INestApplication,
  email = 'tech@test.com',
  password = 'tech123',
): Promise<{ technicianId: string; token: string }> {
  const tech = await prisma.technician.create({
    data: {
      name: 'Technician Test',
      email,
      password: await hash(password, 8),
      availability: ['08:00', '09:00', '10:00', '14:00', '15:00'],
    },
  })

  const loginRes = await request(app.getHttpServer())
    .post('/sessions')
    .send({ email, password })

  return { technicianId: tech.id, token: loginRes.body.access_token as string }
}
