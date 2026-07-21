import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Tenants (e2e)', () => {
  let app: INestApplication;

  const tenantsStore: any[] = [];

  const mockPrismaService = {
    tenant: {
      findFirst: jest.fn(async ({ where }: any) => {
        if (where?.slug) return tenantsStore.find((t) => t.slug === where.slug) ?? null;
        return null;
      }),
      create: jest.fn(async ({ data }: any) => {
        const id = `t-${tenantsStore.length + 1}`;
        const record = { id, ...data, createdAt: new Date(), updatedAt: new Date() };
        tenantsStore.push(record);
        return record;
      }),
      findMany: jest.fn(async () => tenantsStore.filter((t) => t.deletedAt == null)),
      findUnique: jest.fn(async ({ where }: any) => tenantsStore.find((t) => t.id === where.id) ?? null),
      update: jest.fn(async ({ where, data }: any) => {
        const idx = tenantsStore.findIndex((t) => t.id === where.id);
        if (idx === -1) return null;
        tenantsStore[idx] = { ...tenantsStore[idx], ...data, updatedAt: new Date() };
        return tenantsStore[idx];
      }),
    },
  };

  beforeEach(async () => {
    tenantsStore.length = 0;

    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider('PrismaService')
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    // mirror main.ts runtime behavior
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/v1/tenants (POST) -> 201', async () => {
    const payload = { name: 'Acme', slug: 'acme', email: 'hello@acme.test' };
    const res = await request(app.getHttpServer()).post('/api/v1/tenants').send(payload).expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(payload.name);
    expect(res.body.slug).toBe(payload.slug);
  });

  it('/api/v1/tenants (GET) -> list includes created', async () => {
    const payload = { name: 'Acme', slug: 'acme' };
    await request(app.getHttpServer()).post('/api/v1/tenants').send(payload).expect(201);

    const res = await request(app.getHttpServer()).get('/api/v1/tenants').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it('/api/v1/tenants/:id (GET, PATCH, DELETE) flow', async () => {
    const payload = { name: 'Beta', slug: 'beta' };
    const createRes = await request(app.getHttpServer()).post('/api/v1/tenants').send(payload).expect(201);
    const id = createRes.body.id;

    const getRes = await request(app.getHttpServer()).get(`/api/v1/tenants/${id}`).expect(200);
    expect(getRes.body.id).toBe(id);

    const patchRes = await request(app.getHttpServer())
      .patch(`/api/v1/tenants/${id}`)
      .send({ name: 'Beta Updated' })
      .expect(200);
    expect(patchRes.body.name).toBe('Beta Updated');

    const delRes = await request(app.getHttpServer()).delete(`/api/v1/tenants/${id}`).expect(200);
    expect(delRes.body.deletedAt).toBeDefined();
  });
});
