import type { Either } from '@/domain/core/either';
import type { ResourceNotFoundError } from '../errors/resource-not-found-error';
import type { ServiceAlreadyInactiveError } from '../errors/service-already-inactive-error';

export interface DeactivateServiceUseCaseRequestDTO {
  serviceId: string;
}

export type DeactivateServiceUseCaseResponseDTO = Either<
  ResourceNotFoundError | ServiceAlreadyInactiveError,
  null
>;
