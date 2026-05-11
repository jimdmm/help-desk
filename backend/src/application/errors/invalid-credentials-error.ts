import { DomainError } from '@/domain/core/errors/domain-error';

export class InvalidCredentialsError extends DomainError {
	constructor() {
		super('Invalid credentials');
	}
}