import { describe, it, expect, beforeEach } from 'vitest';
import { UploadTechnicianProfileImageUseCase } from '@/application/use-cases/upload-technician-profile-image';
import { InMemoryTechnicianRepository } from '../repositories/in-memory-technician-repository';
import { FakeUploader } from '../storage/fake-uploader';
import { makeTechnician } from '../factories/make-technician';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';

describe('UploadTechnicianProfileImageUseCase', () => {
	let technicianRepository: InMemoryTechnicianRepository;
	let uploader: FakeUploader;
	let sut: UploadTechnicianProfileImageUseCase;

	beforeEach(() => {
		technicianRepository = new InMemoryTechnicianRepository();
		uploader = new FakeUploader();
		sut = new UploadTechnicianProfileImageUseCase(technicianRepository, uploader);
	});

	it('should upload a profile image and update the technician', async () => {
		const technician = makeTechnician();
		await technicianRepository.create(technician);

		const result = await sut.execute({
			technicianId: technician.id.toString(),
			fileName: 'avatar.png',
			fileType: 'image/png',
			body: Buffer.from('fake-image'),
		});

		expect(result.isRight()).toBe(true);
		expect(uploader.uploads).toHaveLength(1);
		expect(technicianRepository.items[0].profileImage).toBe('https://fake-storage/avatar.png');
	});

	it('should return ResourceNotFoundError if technician does not exist', async () => {
		const result = await sut.execute({
			technicianId: 'non-existent',
			fileName: 'avatar.png',
			fileType: 'image/png',
			body: Buffer.from('fake-image'),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
