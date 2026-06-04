import { Controller, Get } from '@nestjs/common'
import { Roles } from '@/infra/auth/roles'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchTechnicianTicketsUseCase } from '@/application/use-cases/fetch-technician-tickets'

@Roles('TECHNICIAN')
@Controller('/tickets/assigned')
export class FetchTechnicianTicketsController {
  constructor(private fetchTechnicianTickets: FetchTechnicianTicketsUseCase) {}

  @Get()
  async handle(@CurrentUser() currentUser: UserPayload) {
    const tickets = await this.fetchTechnicianTickets.execute(currentUser.sub)

    return {
      tickets: tickets.map((t) => ({
        id: t.id.toString(),
        title: t.title,
        description: t.description,
        status: t.status.value,
        clientId: t.clientId.toString(),
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
