import { Optional } from "../core/@types/optional"
import { Entity } from "../core/entity"
import { UniqueEntityId } from "../core/unique-entity-id"

interface ClientProps {
	name: string
	email: string
	password: string
	ticketsCreated: string[]
	profileImage?: string
	createdAt: Date
	updatedAt: Date
}

export class Client extends Entity<ClientProps> {
	static create(
		props: Optional<
			ClientProps,
			'createdAt'>,
		id?: UniqueEntityId,
	): Client {
		return new Client(
			{
				...props,
				ticketsCreated: [],
				createdAt: props.createdAt ?? new Date()
			},
			id
		)
	}

	get name() { return this.props.name }
	get email() { return this.props.email }
	get password() { return this.props.password }
	get ticketsCreated() { return this.props.ticketsCreated }
	get profileImage() { return this.props.profileImage }
	get createdAt() { return this.props.createdAt }
	get updatedAt() { return this.props.updatedAt }

	touch() {
		this.props.updatedAt = new Date()
	}

	createTicket(ticketId: string): void {
		this.props.ticketsCreated.push(ticketId)
		this.touch()
	}

	removeTicket(ticketId: string): boolean {
		const index = this.props.ticketsCreated.indexOf(ticketId)
		if (index === -1) {
			return false
		}
		this.props.ticketsCreated.splice(index, 1)
		this.touch()
		return true
	}
}