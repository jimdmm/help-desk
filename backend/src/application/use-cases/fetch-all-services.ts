import { Injectable } from '@nestjs/common'
import type { PaginatedResult, PaginationParams } from '@/application/dtos/pagination-dto'
import type { Service } from '@/domain/entities/service'
import { ServiceRepository } from '@/domain/ports/service-repository'

@Injectable()
export class FetchAllServicesUseCase {
  constructor(private serviceRepository: ServiceRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResult<Service>> {
    return this.serviceRepository.fetchAll(params)
  }
}
