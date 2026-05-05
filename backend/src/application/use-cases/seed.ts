import { Injectable } from '@nestjs/common';
import { Admin } from '@/domain/entities/admin';
import { Technician } from '@/domain/entities/technician';
import { Service } from '@/domain/entities/service';
import { Availability } from '@/domain/value-objects/availability';
import { Money } from '@/domain/value-objects/money';
import { AdminRepository } from '@/domain/ports/admin-repository';
import { TechnicianRepository } from '@/domain/ports/technician-repository';
import { ServiceRepository } from '@/domain/ports/service-repository';
import { HashGenerator } from '@/application/cryptography/hash-generator';

@Injectable()
export class SeedUseCase {
	constructor(
		private adminRepository: AdminRepository,
		private technicianRepository: TechnicianRepository,
		private serviceRepository: ServiceRepository,
		private hashGenerator: HashGenerator,
	) { }

	async execute(): Promise<void> {
		await this.seedAdmin();
		await this.seedTechnicians();
		await this.seedServices();
	}

	// RF11.1 — Create Admin account
	private async seedAdmin(): Promise<void> {
		const existing = await this.adminRepository.findByEmail('admin@helpdesk.com');
		if (existing) return;

		const admin = Admin.create({
			name: 'Administrador',
			email: 'admin@helpdesk.com',
			password: await this.hashGenerator.hash('Admin@123'),
		});

		await this.adminRepository.create(admin);
	}

	// RF11.2 — Create 3 Technicians with distinct availabilities
	private async seedTechnicians(): Promise<void> {
		const technicians = [
			{
				name: 'Carlos Manhã',
				email: 'carlos@helpdesk.com',
				password: 'Tecnico@123',
				// Morning: 08:00–12:00
				availability: ['08:00', '09:00', '10:00', '11:00', '12:00'],
			},
			{
				name: 'Ana Tarde',
				email: 'ana@helpdesk.com',
				password: 'Tecnico@123',
				// Afternoon: 13:00–18:00
				availability: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
			},
			{
				name: 'Pedro Integral',
				email: 'pedro@helpdesk.com',
				password: 'Tecnico@123',
				// Full day: 08:00–18:00
				availability: [
					'08:00',
					'09:00',
					'10:00',
					'11:00',
					'12:00',
					'13:00',
					'14:00',
					'15:00',
					'16:00',
					'17:00',
					'18:00',
				],
			},
		];

		for (const data of technicians) {
			const existing = await this.technicianRepository.findByEmail(data.email);
			if (existing) continue;

			const technician = Technician.create({
				name: data.name,
				email: data.email,
				password: await this.hashGenerator.hash(data.password),
				availability: Availability.create(data.availability),
				ticketsAssigned: [],
			});

			await this.technicianRepository.create(technician);
		}
	}

	// RF11.3 — Create at least 5 Services
	private async seedServices(): Promise<void> {
		const services = [
			{ name: 'Formatação e Reinstalação do Sistema', price: 150.0 },
			{ name: 'Manutenção Preventiva', price: 80.0 },
			{ name: 'Remoção de Vírus e Malware', price: 120.0 },
			{ name: 'Instalação e Configuração de Software', price: 60.0 },
			{ name: 'Recuperação de Dados', price: 200.0 },
			{ name: 'Configuração de Rede', price: 100.0 },
			{ name: 'Suporte Remoto', price: 50.0 },
		];

		for (const data of services) {
			const service = Service.create({
				name: data.name,
				price: Money.create(data.price),
			});

			await this.serviceRepository.create(service);
		}
	}
}
