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

describe('Tickets (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminToken: string
  let clientId: string
  let clientToken: string
  let technicianId: string
  let technicianToken: string
  let serviceId: string

  beforeAll(async () => {
    ;({ app, prisma } = await createApp())
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await cleanDatabase(prisma)

    adminToken = await createAdminAndGetToken(prisma, app)
    ;({ clientId, token: clientToken } = await createClientAndGetToken(app))
    ;({ technicianId, token: technicianToken } = await createTechnicianAndGetToken(prisma, app))

    const { body } = await request(app.getHttpServer())
      .post('/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Service', price: 100 })

    serviceId = body.serviceId
  })

  describe('POST /tickets', () => {
    it('creates a ticket (CLIENT only)', async () => {
      const response = await request(app.getHttpServer())
        .post('/tickets')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          technicianId,
          title: 'Printer not working',
          description: 'The office printer is completely offline',
          serviceIds: [serviceId],
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('ticketId')
    })
  })

  describe('GET /tickets', () => {
    it('returns all tickets for ADMIN', async () => {
      await request(app.getHttpServer())
        .post('/tickets')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          technicianId,
          title: 'Ticket One',
          description: 'Description for ticket one',
          serviceIds: [serviceId],
        })

      const response = await request(app.getHttpServer())
        .get('/tickets')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.tickets).toHaveLength(1)
      expect(response.body.meta.total).toBe(1)
    })
  })

  describe('GET /tickets/me', () => {
    it('returns tickets for the authenticated client', async () => {
      await request(app.getHttpServer())
        .post('/tickets')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          technicianId,
          title: 'My Ticket',
          description: 'Description for my ticket',
          serviceIds: [serviceId],
        })

      const response = await request(app.getHttpServer())
        .get('/tickets/me')
        .set('Authorization', `Bearer ${clientToken}`)

      expect(response.status).toBe(200)
      expect(response.body.tickets).toHaveLength(1)
      expect(response.body.tickets[0].title).toBe('My Ticket')
    })
  })

  describe('GET /tickets/assigned', () => {
    it('returns tickets assigned to the authenticated technician', async () => {
      await request(app.getHttpServer())
        .post('/tickets')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          technicianId,
          title: 'Assigned Ticket',
          description: 'Description for assigned ticket',
          serviceIds: [serviceId],
        })

      const response = await request(app.getHttpServer())
        .get('/tickets/assigned')
        .set('Authorization', `Bearer ${technicianToken}`)

      expect(response.status).toBe(200)
      expect(response.body.tickets).toHaveLength(1)
    })
  })

  describe('PATCH /tickets/:id/start', () => {
    it('transitions ticket from OPEN to IN_PROGRESS', async () => {
      const { body: { ticketId } } = await request(app.getHttpServer())
        .post('/tickets')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          technicianId,
          title: 'Start Ticket',
          description: 'Description for start ticket',
          serviceIds: [serviceId],
        })

      const response = await request(app.getHttpServer())
        .patch(`/tickets/${ticketId}/start`)
        .set('Authorization', `Bearer ${technicianToken}`)

      expect(response.status).toBe(204)

      const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })
      expect(ticket?.status).toBe('IN_PROGRESS')
    })
  })

  describe('PATCH /tickets/:id/close', () => {
    it('transitions ticket from IN_PROGRESS to CLOSED', async () => {
      const { body: { ticketId } } = await request(app.getHttpServer())
        .post('/tickets')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          technicianId,
          title: 'Close Ticket',
          description: 'Description for close ticket',
          serviceIds: [serviceId],
        })

      await request(app.getHttpServer())
        .patch(`/tickets/${ticketId}/start`)
        .set('Authorization', `Bearer ${technicianToken}`)

      const response = await request(app.getHttpServer())
        .patch(`/tickets/${ticketId}/close`)
        .set('Authorization', `Bearer ${technicianToken}`)

      expect(response.status).toBe(204)

      const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })
      expect(ticket?.status).toBe('CLOSED')
    })
  })

  describe('POST /tickets/:id/services', () => {
    it('adds a service to an open ticket', async () => {
      const { body: { serviceId: extraServiceId } } = await request(app.getHttpServer())
        .post('/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Extra Service', price: 50 })

      const { body: { ticketId } } = await request(app.getHttpServer())
        .post('/tickets')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          technicianId,
          title: 'Add Service Ticket',
          description: 'Description for add service ticket',
          serviceIds: [serviceId],
        })

      const response = await request(app.getHttpServer())
        .post(`/tickets/${ticketId}/services`)
        .set('Authorization', `Bearer ${technicianToken}`)
        .send({ serviceId: extraServiceId })

      expect(response.status).toBe(204)

      const ticketServices = await prisma.ticketServices.findMany({
        where: { ticketId },
      })
      expect(ticketServices).toHaveLength(2)
    })
  })
})
