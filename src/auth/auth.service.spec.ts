import { readFileSync } from 'fs';
import { join } from 'path';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';

jest.mock('argon2', () => ({
  verify: jest.fn(),
  hash: jest.fn(),
}));

const mockEmailService = {
  sendVerificationLink: jest.fn().mockResolvedValue(undefined),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('signed-token'),
};

const mockPrismaService = {
  pendingRegistration: {
    findFirst: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(undefined),
    findUnique: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(undefined),
  },
  user: {
    findFirst: jest.fn().mockResolvedValue(null),
    create: jest
      .fn()
      .mockResolvedValue({ id: 'user-1', email: 'test@example.com' }),
    update: jest
      .fn()
      .mockResolvedValue({ id: 'user-1', email: 'test@example.com' }),
  },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'PrismaService',
          useValue: mockPrismaService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should allow a user to exist before a tenant is assigned', () => {
    const schema = readFileSync(
      join(__dirname, '..', '..', 'prisma', 'schema.prisma'),
      'utf8',
    );

    expect(schema).toContain('tenantId  String?');
    expect(schema).toContain('tenant    Tenant?');
  });

  it('should activate the user when email verification succeeds', async () => {
    const pending = {
      id: 'pending-1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: null,
      passwordHash: 'hashed-password',
      token: 'token-123',
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 60_000),
    };

    mockPrismaService.pendingRegistration.findUnique.mockResolvedValueOnce(
      pending,
    );
    mockPrismaService.user.findFirst.mockResolvedValueOnce(null);

    await service.verifyEmail('token-123');

    expect(mockPrismaService.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'test@example.com',
          status: 'ACTIVE',
          emailVerified: true,
        }),
      }),
    );
  });

  it('should issue an access token for a valid active user', async () => {
    const user = {
      id: 'user-1',
      tenantId: 'tenant-1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      passwordHash: 'hashed-password',
      status: 'ACTIVE',
      emailVerified: true,
      createdAt: new Date(),
    };

    mockPrismaService.user.findFirst.mockResolvedValueOnce(user);
    (argon2.verify as jest.Mock).mockResolvedValueOnce(true);

    const result = await service.login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.accessToken).toBe('signed-token');
    expect(result.user.email).toBe('test@example.com');
    expect(mockJwtService.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: user.id,
        email: user.email,
      }),
    );
  });
});
