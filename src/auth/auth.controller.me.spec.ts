import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

const mockUser = {
  id: 'user-1',
  tenantId: 'tenant-1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '1234567890',
  status: 'ACTIVE',
  emailVerified: true,
  createdAt: new Date().toISOString(),
};

const mockPrismaService = {
  user: {
    findUnique: jest.fn().mockResolvedValue(mockUser),
  },
  revokedToken: {
    findUnique: jest.fn().mockResolvedValue(null),
    upsert: jest.fn().mockResolvedValue(undefined),
  },
};

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => mockPrismaService),
}));

import { AuthModule } from './auth.module';

describe('AuthController /auth/me', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return the current authenticated user', async () => {
    const token = jwtService.sign({
      sub: 'user-1',
      email: 'test@example.com',
      tenantId: 'tenant-1',
    });

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      id: 'user-1',
      tenantId: 'tenant-1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      status: 'ACTIVE',
      emailVerified: true,
      createdAt: expect.any(String),
    });
  });

  it('should log out the current user', async () => {
    const token = jwtService.sign({
      sub: 'user-1',
      email: 'test@example.com',
      tenantId: 'tenant-1',
      jti: 'token-1',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      message: 'Logged out successfully',
      email: 'test@example.com',
    });
  });

  it('should reject a revoked token', async () => {
    mockPrismaService.revokedToken.findUnique.mockResolvedValueOnce({
      jti: 'revoked-token',
    });

    const token = jwtService.sign({
      sub: 'user-1',
      email: 'test@example.com',
      tenantId: 'tenant-1',
      jti: 'revoked-token',
    });

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});
