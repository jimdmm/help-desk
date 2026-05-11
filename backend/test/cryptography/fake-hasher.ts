import { HashGenerator } from '@/application/cryptography/hash-generator';
import { HashComparer } from '@/application/cryptography/hash-comparer';

export class FakeHasher implements HashGenerator, HashComparer {
	async hash(plain: string): Promise<string> {
		return plain.concat('-hashed');
	}

	async compare(plain: string, hash: string): Promise<boolean> {
		return plain.concat('-hashed') === hash;
	}
}
