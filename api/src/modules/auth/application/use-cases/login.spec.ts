import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginUseCase } from './login';
import { AuthContract } from '../../domain/repositories/authRepository.contract';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Mocked } from 'vitest';
import { makeFakeProducerLogin } from '../../../../../test/factories/makeProducerLogin';
import { UnauthorizedError } from 'src/shared/domain/errors/unauthorizedError';
import { compare } from 'bcryptjs';

vi.mock('bcryptjs', () => ({
  compare: vi.fn(),
}));

describe('LoginUseCase', () => {
  let mockAuthRepository: Mocked<AuthContract>;
  let mockJwtService: Mocked<JwtService>;
  let mockConfigService: Mocked<ConfigService>;
  let useCase: LoginUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthRepository = {
      findProducer: vi.fn(),
      registerRefreshToken: vi.fn(),
    } as unknown as Mocked<AuthContract>;

    mockJwtService = {
      signAsync: vi.fn(),
    } as unknown as Mocked<JwtService>;

    mockConfigService = {
      get: vi.fn().mockReturnValue('super-secret'),
    } as unknown as Mocked<ConfigService>;

    useCase = new LoginUseCase(
      mockAuthRepository,
      mockJwtService,
      mockConfigService,
    );
  });

  it('Should successfully login and return tokens', async () => {
    const fakeProducer = makeFakeProducerLogin();
    const data = { email: 'test@example.com', password: 'password123' };

    mockAuthRepository.findProducer.mockResolvedValueOnce(fakeProducer);
    vi.mocked(compare).mockResolvedValueOnce(true as never);
    mockJwtService.signAsync.mockResolvedValue('fake-token');

    const result = await useCase.execute(data);

    expect(mockAuthRepository.findProducer).toHaveBeenCalledWith(data.email);
    expect(compare).toHaveBeenCalledWith(
      data.password,
      fakeProducer.hashedPassword,
    );

    expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    expect(mockAuthRepository.registerRefreshToken).toHaveBeenCalledOnce();

    expect(result).toEqual({
      accessToken: 'fake-token',
      refreshToken: 'fake-token',
    });
  });

  it('Should throw UnauthorizedError if producer is not found', async () => {
    const data = { email: 'test@example.com', password: 'password123' };
    mockAuthRepository.findProducer.mockResolvedValueOnce(null);

    await expect(useCase.execute(data)).rejects.toThrow(UnauthorizedError);
    await expect(useCase.execute(data)).rejects.toThrow('Invalid credentials');
    expect(compare).not.toHaveBeenCalled();
  });

  it('Should throw UnauthorizedError if password does not match', async () => {
    const fakeProducer = makeFakeProducerLogin();
    const data = { email: 'test@example.com', password: 'wrong-password' };

    mockAuthRepository.findProducer.mockResolvedValueOnce(fakeProducer);
    vi.mocked(compare).mockResolvedValueOnce(false as never);

    await expect(useCase.execute(data)).rejects.toThrow(UnauthorizedError);
    await expect(useCase.execute(data)).rejects.toThrow('Invalid credentials');
  });
});
