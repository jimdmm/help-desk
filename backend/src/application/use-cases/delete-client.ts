import { left, right } from '@/domain/core/either';
import { ClientRepository } from '@/domain/ports/client-repository';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';
import type {
  DeleteClientUseCaseRequestDTO,
  DeleteClientUseCaseResponseDTO,
} from '@/application/dtos/delete-client-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute({
    clientId,
  }: DeleteClientUseCaseRequestDTO): Promise<DeleteClientUseCaseResponseDTO> {
    const client = await this.clientRepository.findById(clientId);

    if (!client) return left(new ResourceNotFoundError('Client'));

    await this.clientRepository.delete(clientId);

    return right(null);
  }
}
