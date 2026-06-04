import type { PaginatedResult, PaginationParams } from '@/application/dtos/pagination-dto'
import type { Service } from '../entities/service'

export abstract class ServiceRepository {
  abstract create(service: Service): Promise<void>
  abstract findById(id: string): Promise<Service | null>
  abstract fetchAll(params: PaginationParams): Promise<PaginatedResult<Service>>
  abstract save(service: Service): Promise<void>
}
