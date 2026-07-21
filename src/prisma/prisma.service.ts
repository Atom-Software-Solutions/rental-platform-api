import { existsSync } from 'fs';
import * as path from 'path';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import type { PrismaClient as GeneratedPrismaClient } from '../generated/prisma';

const prismaClientEntry = [
  path.resolve(process.cwd(), 'src/generated/prisma'),
  path.resolve(__dirname, '../generated/prisma'),
].find((candidate) => existsSync(candidate));

if (!prismaClientEntry) {
  throw new Error('Unable to locate the generated Prisma client');
}

const { PrismaClient } = require(prismaClientEntry) as typeof import('../generated/prisma');

@Injectable()
export class PrismaService extends (PrismaClient as unknown as typeof GeneratedPrismaClient) implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const adapter = new PrismaPg({ connectionString });

    super({
      log: [],
      adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
