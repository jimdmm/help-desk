import type { Either } from '@/domain/core/either';
import type { Client } from '@/domain/entities/client';
import type { ResourceNotFoundError } from '../errors/resource-not-found-error';

export interface EditClientUseCaseRequestDTO {
  clientId: string;
  name?: string;
  email?: string;
}

export type EditClientUseCaseResponseDTO = Either<
  ResourceNotFoundError,
  { client: Client }
>;
