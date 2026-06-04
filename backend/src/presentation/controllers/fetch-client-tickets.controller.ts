import { Controller, Get } from '@nestjs/common'
import { Roles } from '@/infra/auth/roles'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchClientTicketsUseCase } from '@/application/use-cases/fetch-client-tickets'

@Roles('CLIENT')
@Controller('/tickets/me')
export class FetchClientTicketsController {
  constructor(private fetchClientTickets: FetchClientTicketsUseCase) {}

  @Get()
  async handle(@CurrentUser() currentUser: UserPayload) {
    const tickets = await this.fetchClientTickets.execute(currentUser.sub)

    return {
      tickets: tickets.map((t) => ({
        id: t.id.toString(),
        title: t.title,
        description: t.description,
        status: t.status.value,
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
