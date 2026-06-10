import { Injectable } from '@nestjs/common'
import type { PaginatedResult, PaginationParams } from '@/domain/core/pagination'
import type { Technician } from '@/domain/entities/technician'
import { TechnicianRepository } from '@/domain/ports/technician-repository'

@Injectable()
export class FetchTechnicianUseCase {
  constructor(private technicianRepository: TechnicianRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResult<Technician>> {
    return this.technicianRepository.fetchAll(params)
  }
}
