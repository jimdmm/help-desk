import { left, right } from '@/domain/core/either';
import { Client } from '@/domain/entities/client';
import { ClientRepository } from '@/domain/ports/client-repository';
import { HashGenerator } from '@/application/cryptography/hash-generator';
import { UserAlreadyExistsError } from '@/application/errors/user-already-exists-error';
import type {
  CreateClientUseCaseRequestDTO,
  CreateClientUseCaseResponseDTO,
} from '@/application/dtos/create-client-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateClientUseCase {
  constructor(
    private clientRepository: ClientRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateClientUseCaseRequestDTO): Promise<CreateClientUseCaseResponseDTO> {
    const existing = await this.clientRepository.findByEmail(email);

    if (existing) return left(new UserAlreadyExistsError(email));

    const hashedPassword = await this.hashGenerator.hash(password);

    const client = Client.create({
      name,
      email,
      password: hashedPassword,
      ticketsCreated: [],
      updatedAt: new Date(),
    });

    await this.clientRepository.create(client);

    return right({ client });
  }
}
