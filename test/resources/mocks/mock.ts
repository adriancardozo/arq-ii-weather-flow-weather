import { ModuleMocker } from 'jest-mock';
import { mocks } from './mocks';
import { InjectionToken } from '@nestjs/common';

type Class<T> = new (...args: any[]) => T;

const mocker = new ModuleMocker(global);

export function mock<T>(Token?: InjectionToken): jest.Mocked<T> {
  const ClassToken = Token as Class<T>;
  const OriginalClass = mocks[ClassToken.name] ? mocks[ClassToken.name] : ClassToken;
  const metadata = mocker.getMetadata(OriginalClass);
  if (!metadata) throw new Error('Class is not mockeable');
  const Mocked = mocker.generateFromMetadata(metadata);
  const result = new Mocked() as jest.Mocked<T>;
  return result;
}
