import { left, right } from '@/domain/core/either';
import { ClientRepository } from '@/domain/ports/client-repository';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';
import type {
  EditClientUseCaseRequestDTO,
  EditClientUseCaseResponseDTO,
} from '@/application/dtos/edit-client-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EditClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute({
    clientId,
    name,
    email,
  }: EditClientUseCaseRequestDTO): Promise<EditClientUseCaseResponseDTO> {
    const client = await this.clientRepository.findById(clientId);

    if (!client) return left(new ResourceNotFoundError('Client'));

    if (name !== undefined) client.name = name;
    if (email !== undefined) client.email = email;

    await this.clientRepository.save(client);

    return right({ client });
  }
}
