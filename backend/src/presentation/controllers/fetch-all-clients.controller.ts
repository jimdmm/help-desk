import { Controller, Get } from '@nestjs/common'
import { Roles } from '@/infra/auth/roles'
import { FetchAllClientsUseCase } from '@/application/use-cases/fetch-all-clients'

@Controller('/clients')
export class FetchAllClientsController {
  constructor(private fetchAllClients: FetchAllClientsUseCase) {}

  @Get()
  @Roles('ADMIN')
  async handle() {
    const clients = await this.fetchAllClients.execute()

    return {
      clients: clients.map((c) => ({
        id: c.id.toString(),
        name: c.name,
        email: c.email,
        profileImage: c.profileImage ?? null,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt ?? null,
      })),
    }
  }
}
