import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import type { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('PrismaService')
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    if (!registerDto.email) {
      throw new BadRequestException('Email is required');
    }

    if (!registerDto.password) {
      throw new BadRequestException('Password is required');
    }

    const existingPending = await this.prisma.pendingRegistration.findFirst({
      where: {
        email: registerDto.email,
        status: 'PENDING',
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (existingPending) {
      throw new ConflictException('Verification already sent to this email address');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const passwordHash = await argon2.hash(registerDto.password);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.pendingRegistration.create({
      data: {
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phone: registerDto.phone,
        passwordHash,
        token,
        expiresAt,
      },
    });

    await this.emailService.sendVerificationLink(registerDto.email, token);

    return {
      message: 'Verification email sent',
      email: registerDto.email,
    };
  }

  async verifyEmail(token: string) {
    const pending = await this.prisma.pendingRegistration.findUnique({
      where: { token },
    });

    if (!pending || pending.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (pending.status !== 'PENDING') {
      return {
        token: pending.token,
        status: pending.status,
        verified: pending.status === 'VERIFIED' || pending.status === 'COMPLETED',
      };
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: pending.email,
      },
    });

    if (existingUser) {
      await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          status: 'ACTIVE',
          emailVerified: true,
          updatedBy: pending.email,
        },
      });
    } else {
      await this.prisma.user.create({
        data: {
          firstName: pending.firstName,
          lastName: pending.lastName,
          email: pending.email,
          phone: pending.phone,
          passwordHash: pending.passwordHash,
          status: 'ACTIVE',
          emailVerified: true,
          createdBy: pending.email,
          updatedBy: pending.email,
        },
      });
    }

    await this.prisma.pendingRegistration.update({
      where: { token },
      data: {
        status: 'VERIFIED',
        verifiedAt: new Date(),
      },
    });

    return {
      token: pending.token,
      email: pending.email,
      verified: true,
    };
  }

  async createTenant(dto: CreateTenantDto) {
    const pending = await this.prisma.pendingRegistration.findUnique({
      where: { token: dto.token },
    });

    if (!pending || pending.status !== 'VERIFIED' || pending.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired registration token');
    }

    const slug = await this.generateUniqueSlug(dto.name);
    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.name,
        slug,
        email: dto.email ?? pending.email,
        phone: dto.phone,
        createdBy: pending.email,
        updatedBy: pending.email,
      },
    });

    const user = await this.prisma.user.create({
      data: {
        tenantId: tenant.id,
        firstName: pending.firstName,
        lastName: pending.lastName,
        email: pending.email,
        phone: pending.phone,
        passwordHash: pending.passwordHash,
        status: 'ACTIVE',
        emailVerified: true,
        createdBy: pending.email,
        updatedBy: pending.email,
      },
      select: {
        id: true,
        tenantId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        status: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    await this.prisma.pendingRegistration.update({
      where: { token: dto.token },
      data: {
        status: 'COMPLETED',
        usedAt: new Date(),
        tenantId: tenant.id,
        userId: user.id,
      },
    });

    return {
      tenant,
      user,
    };
  }

  private async generateUniqueSlug(name: string) {
    const slugBase = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let slug = slugBase;
    let suffix = 1;

    while (
      await this.prisma.tenant.findFirst({
        where: {
          slug,
        },
      })
    ) {
      slug = `${slugBase}-${suffix}`;
      suffix += 1;
    }

    return slug;
  }
}
