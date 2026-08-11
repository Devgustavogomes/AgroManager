import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RefreshUseCase } from './refresh';
import { AuthContract } from '../../domain/repositories/authRepository.contract';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Mocked } from 'vitest';
import { UnauthorizedError } from 'src/shared/domain/errors/unauthorizedError';
import { Role } from 'src/shared/application/types/role';

describe('RefreshUseCase', () => {
  let mockAuthRepository: Mocked<AuthContract>;
  let mockJwtService: Mocked<JwtService>;
  let mockConfigService: Mocked<ConfigService>;
  let useCase: RefreshUseCase;

  beforeEach(() => {
    mockAuthRepository = {
      verifyRefreshToken: vi.fn(),
      registerRefreshToken: vi.fn(),
    } as unknown as Mocked<AuthContract>;

    mockJwtService = {
      verifyAsync: vi.fn(),
      signAsync: vi.fn(),
    } as unknown as Mocked<JwtService>;

    mockConfigService = {
      get: vi.fn().mockReturnValue('super-secret'),
    } as unknown as Mocked<ConfigService>;

    useCase = new RefreshUseCase(
      mockAuthRepository,
      mockJwtService,
      mockConfigService,
    );
  });

  it('Should throw UnauthorizedError if token is not provided', async () => {
    await expect(useCase.execute('')).rejects.toThrow(UnauthorizedError);
  });

  it('Should throw UnauthorizedError if registered token is not found', async () => {
    const refreshToken = 'valid-token';
    const payload = { id: 'producer-123', role: Role.USER };

    mockJwtService.verifyAsync.mockResolvedValueOnce(payload);
    mockAuthRepository.verifyRefreshToken.mockResolvedValueOnce(null);

    await expect(useCase.execute(refreshToken)).rejects.toThrow(
      UnauthorizedError,
    );
    expect(mockAuthRepository.verifyRefreshToken).toHaveBeenCalledWith(
      payload.id,
    );
  });

  it('Should throw UnauthorizedError if registered token does not match provided token', async () => {
    const refreshToken = 'valid-token';
    const payload = { id: 'producer-123', role: Role.USER };

    mockJwtService.verifyAsync.mockResolvedValueOnce(payload);
    mockAuthRepository.verifyRefreshToken.mockResolvedValueOnce(
      'different-token',
    );

    await expect(useCase.execute(refreshToken)).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it('Should successfully refresh and return new tokens', async () => {
    const refreshToken = 'valid-token';
    const payload = { id: 'producer-123', role: Role.USER, iat: 123, exp: 456 };

    mockJwtService.verifyAsync.mockResolvedValueOnce(payload);
    mockAuthRepository.verifyRefreshToken.mockResolvedValueOnce(refreshToken);
    mockJwtService.signAsync.mockResolvedValue('new-fake-token');

    const result = await useCase.execute(refreshToken);

    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(
      refreshToken,
      expect.any(Object),
    );
    expect(mockAuthRepository.verifyRefreshToken).toHaveBeenCalledWith(
      payload.id,
    );

    // signAsync called for both accessToken and newRefreshToken
    expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    expect(mockAuthRepository.registerRefreshToken).toHaveBeenCalledOnce();

    expect(result).toEqual({
      accessToken: 'new-fake-token',
      newRefreshToken: 'new-fake-token',
    });
  });
});
