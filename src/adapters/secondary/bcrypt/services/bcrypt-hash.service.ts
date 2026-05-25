import { IHashService } from 'src/bussiness/ports/output/services/i-hash.service';
import bcrypt from 'bcrypt';

export class BcryptHashService implements IHashService {
  async hash(plain: string): Promise<string> {
    const SALT = bcrypt.genSaltSync();
    return await bcrypt.hash(plain, SALT);
  }

  compare(plain: string, hash: string): boolean {
    return bcrypt.compareSync(plain, hash);
  }
}
