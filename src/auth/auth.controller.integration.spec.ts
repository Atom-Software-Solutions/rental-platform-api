import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

const mockUser = {
  id: 'user-1',
  tenantId: 'tenant-1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '1234567890',
  status: 'PENDING',
  createdAt: new Date(),
};

const mockPrismaService = {
  pendingRegistration: {
    findFirst: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ id: 'pending-1' }),
  },
  user: {
    findFirst: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(mockUser),
  },
  tenant: {
    findFirst: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({
      id: 'tenant-1',
      name: 'Test Tenant',
      slug: 'test-tenant',
      email: 'test@example.com',
      phone: null,
      status: 'ACTIVE',
      deletedAt: null,
      createdBy: 'test@example.com',
      updatedBy: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  },
};

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => mockPrismaService),
}));

import { AuthModule } from './auth.module';
import { EmailService } from './email.service';

describe('AuthController Integration', () => {
  let app: INestApplication;
  let sendVerificationLinkSpy: jest.SpyInstance;

  beforeAll(async () => {
    sendVerificationLinkSpy = jest
      .spyOn(EmailService.prototype, 'sendVerificationLink')
      .mockResolvedValue({
        success: true,
        info: 'Verification link sent to test@example.com',
        verificationUrl: 'http://localhost:3000/auth/verify-email?token=test-token',
      });

    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    sendVerificationLinkSpy.mockRestore();
    await app.close();
  });

  it('should reject an empty registration payload with a validation error', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({}).expect(400);
  });

  it('should register a user through the auth route', async () => {
    const payload = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(payload)
      .expect(201);

    expect(response.body).toEqual({
      message: 'Verification email sent',
      email: 'test@example.com',
    });

    expect(mockPrismaService.pendingRegistration.findFirst).toHaveBeenCalledWith({
      where: {
        email: 'test@example.com',
        status: 'PENDING',
        expiresAt: {
          gt: expect.any(Date),
        },
      },
    });
    expect(mockPrismaService.pendingRegistration.create).toHaveBeenCalled();
    expect(sendVerificationLinkSpy).toHaveBeenCalledWith(
      'test@example.com',
      expect.any(String),
    );
  });
});
