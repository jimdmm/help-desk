import type { Either } from '@/domain/core/either';
import type { Service } from '@/domain/entities/service';

export interface CreateServiceUseCaseRequestDTO {
  name: string;
  price: number;
}

export type CreateServiceUseCaseResponseDTO = Either<
  never,
  { service: Service }
>;
