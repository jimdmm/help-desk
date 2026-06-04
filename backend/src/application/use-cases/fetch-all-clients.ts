import { Injectable } from '@nestjs/common'
import type { PaginatedResult, PaginationParams } from '@/application/dtos/pagination-dto'
import type { Client } from '@/domain/entities/client'
import { ClientRepository } from '@/domain/ports/client-repository'

@Injectable()
export class FetchAllClientsUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResult<Client>> {
    return this.clientRepository.fetchAll(params)
  }
}
