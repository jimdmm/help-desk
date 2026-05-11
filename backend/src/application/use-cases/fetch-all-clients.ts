import { Injectable } from '@nestjs/common';
import type { Client } from '@/domain/entities/client';
import { ClientRepository } from '@/domain/ports/client-repository';

@Injectable()
export class FetchAllClientsUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(): Promise<Client[]> {
    return this.clientRepository.fetchAll();
  }
}
