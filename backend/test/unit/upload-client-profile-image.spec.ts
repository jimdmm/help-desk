import { describe, it, expect, beforeEach } from 'vitest';
import { UploadClientProfileImageUseCase } from '@/application/use-cases/upload-client-profile-image';
import { InMemoryClientRepository } from '../repositories/in-memory-client-repository';
import { FakeUploader } from '../storage/fake-uploader';
import { makeClient } from '../factories/make-client';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';

describe('UploadClientProfileImageUseCase', () => {
	let clientRepository: InMemoryClientRepository;
	let uploader: FakeUploader;
	let sut: UploadClientProfileImageUseCase;

	beforeEach(() => {
		clientRepository = new InMemoryClientRepository();
		uploader = new FakeUploader();
		sut = new UploadClientProfileImageUseCase(clientRepository, uploader);
	});

	it('should upload a profile image and update the client', async () => {
		const client = makeClient();
		await clientRepository.create(client);

		const result = await sut.execute({
			clientId: client.id.toString(),
			fileName: 'avatar.png',
			fileType: 'image/png',
			body: Buffer.from('fake-image'),
		});

		expect(result.isRight()).toBe(true);
		expect(uploader.uploads).toHaveLength(1);
		expect(clientRepository.items[0].profileImage).toBe('https://fake-storage/avatar.png');
	});

	it('should return ResourceNotFoundError if client does not exist', async () => {
		const result = await sut.execute({
			clientId: 'non-existent',
			fileName: 'avatar.png',
			fileType: 'image/png',
			body: Buffer.from('fake-image'),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
