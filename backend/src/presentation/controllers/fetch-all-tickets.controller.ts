import { Controller, Get } from '@nestjs/common'
import { Roles } from '@/infra/auth/roles'
import { FetchAllTicketsUseCase } from '@/application/use-cases/fetch-all-tickets'

@Roles('ADMIN')
@Controller('/tickets')
export class FetchAllTicketsController {
  constructor(private fetchAllTickets: FetchAllTicketsUseCase) {}

  @Get()
  async handle() {
    const tickets = await this.fetchAllTickets.execute()

    return {
      tickets: tickets.map((t) => ({
        id: t.id.toString(),
        title: t.title,
        description: t.description,
        status: t.status.value,
        clientId: t.clientId.toString(),
        technicianId: t.technicianId.toString(),
        total: t.total,
        services: t.services.getItems().map((s) => ({
          id: s.id.toString(),
          name: s.serviceName,
          price: s.price.value,
        })),
        createdAt: t.createdAt,
        updatedAt: t.updatedAt ?? null,
      })),
    }
  }
}
