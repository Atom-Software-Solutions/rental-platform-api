import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(@Inject('PrismaService') private readonly prisma: PrismaService) {}

  async create(createTenantDto: CreateTenantDto) {
    const existing = await this.prisma.tenant.findFirst({ where: { slug: createTenantDto.slug } });

    if (existing) {
      throw new ConflictException('Tenant with this slug already exists');
    }

    return this.prisma.tenant.create({ data: { ...createTenantDto } });
  }

  async findAll() {
    return this.prisma.tenant.findMany({ where: { deletedAt: null } });
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto) {
    await this.findOne(id);

    return this.prisma.tenant.update({ where: { id }, data: { ...updateTenantDto } });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.tenant.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
