import { ConflictError } from 'src/shared/domain/errors/conflictError';
import { ValidateMaxProperties } from './validateMaxProperties.service';

describe('Validade Max Properties', () => {
  it('Should be succesfull', () => {
    expect(ValidateMaxProperties.execute(2)).toBeUndefined();
  });
  it('Should throw conflict error if producer has more or equal than 5 properties', () => {
    expect(() => ValidateMaxProperties.execute(5)).toThrow(ConflictError);
    expect(() => ValidateMaxProperties.execute(6)).toThrow(ConflictError);
  });
});
