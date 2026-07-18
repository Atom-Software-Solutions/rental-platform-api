import { readFileSync } from 'fs';
import { join } from 'path';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';

const mockPrismaService = {
  pendingRegistration: {
    findFirst: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(undefined),
    findUnique: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(undefined),
  },
  user: {
    findFirst: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ id: 'user-1', email: 'test@example.com' }),
    update: jest.fn().mockResolvedValue({ id: 'user-1', email: 'test@example.com' }),
  },
};

const mockEmailService = {
  sendVerificationLink: jest.fn().mockResolvedValue(undefined),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should allow a user to exist before a tenant is assigned', () => {
    const schema = readFileSync(join(__dirname, '..', '..', 'prisma', 'schema.prisma'), 'utf8');

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

    mockPrismaService.pendingRegistration.findUnique.mockResolvedValueOnce(pending);
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
});
