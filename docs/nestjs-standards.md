# NestJS Project Standards — 2025

## Table of Contents

1. [What is NestJS?](#1-what-is-nestjs)
2. [Scaffolding a New Project](#2-scaffolding-a-new-project)
3. [Project Structure](#3-project-structure)
4. [Core Building Blocks](#4-core-building-blocks)
5. [Configuration](#5-configuration)
6. [Validation and Serialization](#6-validation-and-serialization)
7. [Authentication and Authorization](#7-authentication-and-authorization)
8. [Database Integration](#8-database-integration)
9. [Error Handling](#9-error-handling)
10. [Testing](#10-testing)
11. [OpenAPI / Swagger](#11-openapi--swagger)
12. [Performance and Production](#12-performance-and-production)
13. [Cheat Sheet](#13-cheat-sheet)

---

## 1. What is NestJS?

NestJS is a Node.js framework for building scalable server-side applications. It uses TypeScript by default and is built on top of Express (or optionally Fastify). Its architecture is heavily inspired by Angular — modules, decorators, and dependency injection are first-class concepts.

**Current stable version:** NestJS 11 (2025)

### When to choose NestJS

| Use Case | Fits NestJS? |
|---|---|
| REST API | Yes |
| GraphQL API | Yes (built-in module) |
| Microservices | Yes (built-in transports) |
| WebSocket server | Yes (built-in gateway) |
| CQRS / event-driven | Yes (`@nestjs/cqrs`) |
| Simple CRUD proxy | Overkill — consider Hono or Fastify |

---

## 2. Scaffolding a New Project

### Using the NestJS CLI

```bash
npm install -g @nestjs/cli
nest new my-api
```

The CLI prompts for a package manager. Select `yarn` or `pnpm` for consistency with the monorepo standard.

### In a Yarn monorepo workspace

```bash
cd packages
nest new api --skip-git --package-manager yarn
```

Then add the workspace to the root `package.json`:

```json
{
  "workspaces": ["packages/web", "packages/api", "packages/shared"]
}
```

### Generated structure

```
src/
├── app.controller.ts
├── app.controller.spec.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

### `main.ts` — production-ready baseline

```ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // URI versioning: /api/v1/users
  app.enableVersioning({ type: VersioningType.URI });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // strip properties not in DTO
      forbidNonWhitelisted: true, // throw if extra properties sent
      transform: true,        // auto-transform payloads to DTO class instances
    })
  );

  // CORS
  app.enableCors({ origin: process.env.ALLOWED_ORIGINS?.split(',') });

  // Swagger (disable in production)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

---

## 3. Project Structure

NestJS enforces a module-based structure. Organize by **feature**, not by type.

```
src/
├── main.ts
├── app.module.ts
│
├── config/                    ← configuration module
│   ├── config.module.ts
│   └── config.service.ts
│
├── common/                    ← shared decorators, guards, pipes, interceptors
│   ├── decorators/
│   │   └── current-user.decorator.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── interceptors/
│   │   └── transform.interceptor.ts
│   └── filters/
│       └── http-exception.filter.ts
│
├── users/                     ← feature module
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.repository.ts    ← optional: wraps DB calls
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   └── entities/
│       └── user.entity.ts
│
└── posts/                     ← another feature module
    ├── posts.module.ts
    ├── posts.controller.ts
    ├── posts.service.ts
    └── dto/
        └── create-post.dto.ts
```

---

## 4. Core Building Blocks

### Module

Every feature lives in a module. Modules declare what they export so other modules can use it.

```ts
// users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // allow other modules to inject UsersService
})
export class UsersModule {}
```

```ts
// app.module.ts
@Module({
  imports: [UsersModule, PostsModule, ConfigModule],
})
export class AppModule {}
```

### Controller

Controllers handle HTTP requests. Keep them thin — no business logic.

```ts
// users/users.controller.ts
import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, Version } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a user' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

### Service

Services contain business logic and are injectable providers.

```ts
// users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // throws if not found
    await this.userRepository.delete(id);
  }
}
```

### Guards

Guards determine whether a request is allowed to proceed. Used for authentication and authorization.

```ts
// common/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@passport/nestjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Apply a guard to a single route or an entire controller:

```ts
@UseGuards(JwtAuthGuard)
@Get('me')
getProfile(@Request() req) {
  return req.user;
}
```

Apply globally in `main.ts` or in `AppModule`:

```ts
app.useGlobalGuards(new JwtAuthGuard());
```

### Interceptors

Interceptors transform responses or add cross-cutting behavior (logging, caching, response mapping).

```ts
// common/interceptors/transform.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, { data: T }> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<{ data: T }> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
```

### Pipes

Pipes transform or validate input. The built-in `ValidationPipe` (set globally in `main.ts`) handles DTO validation automatically.

Custom pipe example:

```ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class ParseUUIDPipe implements PipeTransform {
  transform(value: string) {
    if (!isUUID(value)) throw new BadRequestException(`${value} is not a valid UUID`);
    return value;
  }
}
```

### Custom Decorators

```ts
// common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

```ts
@Get('me')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user: User) {
  return user;
}
```

---

## 5. Configuration

Use `@nestjs/config` to manage environment variables with type safety.

```bash
npm install @nestjs/config
```

`.env`:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
JWT_SECRET=supersecret
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

```ts
// config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('7d'),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,                      // no need to import in every module
      validate: (config) => envSchema.parse(config),
    }),
  ],
})
export class ConfigModule {}
```

Inject and use:

```ts
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly config: ConfigService) {}

  getJwtSecret() {
    return this.config.getOrThrow<string>('JWT_SECRET');
  }
}
```

---

## 6. Validation and Serialization

### DTOs with `class-validator`

```bash
npm install class-validator class-transformer
```

```ts
// users/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;
}
```

### Response serialization with `class-transformer`

Use `@Exclude()` to prevent sensitive fields from leaking in responses.

```ts
// users/entities/user.entity.ts
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()         // never serialized in responses
  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  bio: string | null;
}
```

Enable serialization globally:

```ts
// main.ts
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
```

---

## 7. Authentication and Authorization

### JWT Authentication with Passport

```bash
npm install @nestjs/passport @nestjs/jwt passport passport-jwt
npm install -D @types/passport-jwt
```

```ts
// auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user; // attached to request.user
  }
}
```

```ts
// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { accessToken: this.jwtService.sign({ sub: user.id }) };
  }
}
```

### Role-based authorization

```ts
// common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

```ts
// common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

```ts
@Delete(':id')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
remove(@Param('id') id: string) { ... }
```

---

## 8. Database Integration

### Option A — TypeORM (SQL)

```bash
npm install @nestjs/typeorm typeorm pg
```

```ts
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow('DATABASE_URL'),
        autoLoadEntities: true,    // loads entities registered with forFeature()
        synchronize: config.get('NODE_ENV') === 'development', // never true in production
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),
  ],
})
export class AppModule {}
```

```ts
// users/users.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // registers User entity and its repository
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### Option B — Prisma (recommended for new projects)

Prisma provides type-safe database access with auto-generated types from your schema.

```bash
npm install prisma @prisma/client
npx prisma init
```

`prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  username     String   @unique
  email        String   @unique
  passwordHash String
  bio          String?
  createdAt    DateTime @default(now())
  posts        Post[]
}

model Post {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now())
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}
```

Create a Prisma service to expose the client:

```ts
// prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

```ts
// prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';

@Global()  // makes PrismaService available everywhere without importing
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

```ts
// users/users.service.ts (with Prisma)
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({ data: dto });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }
}
```

### Migrations

```bash
# TypeORM
npx typeorm migration:generate src/migrations/AddBioToUser
npx typeorm migration:run

# Prisma
npx prisma migrate dev --name add-bio-to-user
npx prisma migrate deploy   # production
```

---

## 9. Error Handling

### Built-in HTTP exceptions

```ts
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

throw new NotFoundException('User not found');
throw new ConflictException('Email already in use');
throw new BadRequestException('Invalid input');
```

### Global exception filter

```ts
// common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if (status >= 500) {
      this.logger.error(exception);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

Register globally in `main.ts`:

```ts
app.useGlobalFilters(new GlobalExceptionFilter());
```

---

## 10. Testing

### Unit tests

NestJS generates `.spec.ts` files alongside each service and controller. Use `@nestjs/testing` to create a testing module.

```ts
// users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('throws NotFoundException for unknown user', async () => {
    repository.findOneBy.mockResolvedValue(null);
    await expect(service.findOne('unknown-id')).rejects.toThrow(NotFoundException);
  });
});
```

### E2E tests

```ts
// test/users.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(() => app.close());

  it('POST /api/v1/users → 201', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({ username: 'testuser', email: 'test@test.com', password: 'password123' })
      .expect(201)
      .expect((res) => {
        expect(res.body.data.email).toBe('test@test.com');
        expect(res.body.data.passwordHash).toBeUndefined();
      });
  });
});
```

Run tests:

```bash
yarn test           # unit tests
yarn test:e2e       # end-to-end tests
yarn test:cov       # coverage report
```

---

## 11. OpenAPI / Swagger

```bash
npm install @nestjs/swagger
```

The setup in `main.ts` (shown in section 2) generates an interactive docs page at `/docs`.

### Decorating DTOs

```ts
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Unique username' })
  @IsString()
  username: string;
}

// PartialType makes all fields optional and preserves Swagger decorators
export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

### Decorating controllers

```ts
@ApiTags('users')
@ApiBearerAuth()
@Controller({ path: 'users', version: '1' })
export class UsersController {

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  findOne(@Param('id') id: string) { ... }
}
```

---

## 12. Performance and Production

### Use Fastify adapter for higher throughput

```bash
npm install @nestjs/platform-fastify
```

```ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
);
await app.listen(3000, '0.0.0.0');
```

### Caching with Redis

```bash
npm install @nestjs/cache-manager cache-manager cache-manager-redis-yet
```

```ts
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: redisStore,
        url: config.getOrThrow('REDIS_URL'),
        ttl: 60_000, // 60 seconds in ms
      }),
    }),
  ],
})
export class AppModule {}
```

```ts
@Injectable()
export class UsersService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async findOne(id: string) {
    const cached = await this.cache.get<User>(`user:${id}`);
    if (cached) return cached;
    const user = await this.userRepository.findOneBy({ id });
    await this.cache.set(`user:${id}`, user, 60_000);
    return user;
  }
}
```

### Compression and Helmet

```bash
npm install compression helmet
```

```ts
import compression from 'compression';
import helmet from 'helmet';

app.use(helmet());
app.use(compression());
```

### Graceful shutdown

```ts
app.enableShutdownHooks(); // listens for SIGTERM, SIGINT and runs onModuleDestroy
```

---

## 13. Cheat Sheet

### CLI commands

```bash
nest new my-api                        # scaffold project
nest generate module users             # g mo users
nest generate controller users         # g co users
nest generate service users            # g s users
nest generate guard jwt-auth           # g gu jwt-auth
nest generate interceptor transform    # g in transform
nest generate filter http-exception    # g f http-exception
nest generate pipe parse-uuid          # g pi parse-uuid
nest generate resource posts           # full CRUD resource (controller + service + DTOs)
```

### Core packages

```bash
# Validation
npm install class-validator class-transformer

# Config
npm install @nestjs/config

# Auth
npm install @nestjs/passport @nestjs/jwt passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt

# Database — TypeORM
npm install @nestjs/typeorm typeorm pg

# Database — Prisma
npm install prisma @prisma/client

# API docs
npm install @nestjs/swagger

# Testing
npm install -D supertest @types/supertest
```

### Request lifecycle (in order)

```
Incoming Request
  → Middleware
  → Guards
  → Interceptors (before)
  → Pipes
  → Controller / Route Handler
  → Interceptors (after)
  → Exception Filters (if error)
→ Response
```

---

## References

- NestJS docs: https://docs.nestjs.com
- NestJS GitHub: https://github.com/nestjs/nest
- TypeORM docs: https://typeorm.io
- Prisma docs: https://www.prisma.io/docs
- class-validator docs: https://github.com/typestack/class-validator
