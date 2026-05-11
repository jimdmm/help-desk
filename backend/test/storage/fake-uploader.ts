import { Uploader, type UploadParams, type UploadResult } from '@/application/storage/uploader';

export class FakeUploader implements Uploader {
	public uploads: UploadParams[] = [];

	async upload(params: UploadParams): Promise<UploadResult> {
		this.uploads.push(params);
		return { url: `https://fake-storage/${params.fileName}` };
	}
}
