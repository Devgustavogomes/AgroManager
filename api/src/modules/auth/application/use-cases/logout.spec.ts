import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LogoutUseCase } from './logout';
import { AuthContract } from '../../domain/repositories/authRepository.contract';
import { Mocked } from 'vitest';

describe('LogoutUseCase', () => {
  let mockAuthRepository: Mocked<AuthContract>;
  let useCase: LogoutUseCase;

  beforeEach(() => {
    mockAuthRepository = {
      unregisterRefreshToken: vi.fn(),
    } as unknown as Mocked<AuthContract>;

    useCase = new LogoutUseCase(mockAuthRepository);
  });

  it('Should successfully unregister refresh token', async () => {
    const producerId = 'producer-123';
    mockAuthRepository.unregisterRefreshToken.mockResolvedValueOnce();

    await useCase.execute(producerId);

    expect(mockAuthRepository.unregisterRefreshToken).toHaveBeenCalledOnce();
    expect(mockAuthRepository.unregisterRefreshToken).toHaveBeenCalledWith(
      producerId,
    );
  });
});
