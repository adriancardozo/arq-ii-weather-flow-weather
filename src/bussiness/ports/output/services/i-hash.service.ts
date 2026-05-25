export abstract class IHashService {
  abstract hash(plain: string): Promise<string>;

  abstract compare(plain: string, hash: string): boolean;
}
