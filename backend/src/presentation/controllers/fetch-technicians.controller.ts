import { Controller, Get } from '@nestjs/common'
import { FetchTechnicianUseCase } from '@/application/use-cases/fetch-technician'

@Controller('/technicians')
export class FetchTechniciansController {
  constructor(private fetchTechnician: FetchTechnicianUseCase) {}

  @Get()
  async handle() {
    const technicians = await this.fetchTechnician.execute()

    return {
      technicians: technicians.map((t) => ({
        id: t.id.toString(),
        name: t.name,
        email: t.email,
        availability: t.availability.schedules,
        profileImage: t.profileImage ?? null,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt ?? null,
      })),
    }
  }
}
