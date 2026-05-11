import type { Either } from '@/domain/core/either';
import type { Service } from '@/domain/entities/service';
import type { ResourceNotFoundError } from '../errors/resource-not-found-error';

export interface EditServiceUseCaseRequestDTO {
  serviceId: string;
  name?: string;
  price?: number;
}

export type EditServiceUseCaseResponseDTO = Either<
  ResourceNotFoundError,
  { service: Service }
>;
