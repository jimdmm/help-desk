import type { Client } from '../entities/client';

export abstract class ClientRepository {
  abstract create(client: Client): Promise<void>;
  abstract findById(id: string): Promise<Client | null>;
  abstract findByEmail(email: string): Promise<Client | null>;
  abstract fetchAll(): Promise<Client[]>;
  abstract save(client: Client): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
