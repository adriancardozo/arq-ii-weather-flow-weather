import { IHashService } from 'src/bussiness/ports/output/services/i-hash.service';

export class MockHashService implements IHashService {
  hash(plain: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  compare(plain: string, hash: string): boolean {
    throw new Error('Method not implemented.');
  }
}
