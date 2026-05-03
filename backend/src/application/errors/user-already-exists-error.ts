import { DomainError } from "@/domain/core/errors/domain-error";

export class UserAlreadyExistsError extends DomainError {
    constructor(identifier: string) {
        super(`User "${identifier}" already exists.`)
    }
}
