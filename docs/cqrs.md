# CQRS — Complete Guide

## Table of Contents

1. [What is CQRS?](#1-what-is-cqrs)
2. [Core Concepts](#2-core-concepts)
3. [Commands](#3-commands)
4. [Queries](#4-queries)
5. [Events](#5-events)
6. [Event Sourcing](#6-event-sourcing)
7. [CQRS in NestJS](#7-cqrs-in-nestjs)
8. [Full Example — Posts Feature](#8-full-example--posts-feature)
9. [When to Use CQRS](#9-when-to-use-cqrs)
10. [Common Pitfalls](#10-common-pitfalls)
11. [Cheat Sheet](#11-cheat-sheet)

---

## 1. What is CQRS?

**CQRS** (Command Query Responsibility Segregation) is a pattern that separates write operations (**commands**) from read operations (**queries**) into distinct models.

The term was coined by Greg Young, building on the CQS (Command-Query Separation) principle by Bertrand Meyer, which states:

> A method should either change state (command) or return data (query) — never both.

CQRS scales this principle to the architecture level: separate classes, handlers, and potentially separate data stores for reads and writes.

### Traditional architecture vs CQRS

**Traditional (single model):**

```
Controller
  → Service.createPost(dto)     ← writes AND reads through same model
  → Service.getPosts()
  → Repository (single DB model)
```

**CQRS:**

```
Controller
  → CommandBus.execute(new CreatePostCommand(dto))   ← write path
  → QueryBus.execute(new GetPostsQuery())             ← read path

CommandBus → CreatePostHandler → WriteRepository (normalized DB)
QueryBus   → GetPostsHandler   → ReadRepository  (denormalized, optimized for reads)
```

---

## 2. Core Concepts

| Concept | Role |
|---|---|
| **Command** | Intent to change state. Has no return value (or returns only an ID). |
| **Query** | Request for data. Never changes state. |
| **CommandBus** | Routes a command to its handler. One handler per command. |
| **QueryBus** | Routes a query to its handler. One handler per query. |
| **EventBus** | Publishes domain events. Multiple handlers can subscribe. |
| **Command Handler** | Executes business logic for one command type. |
| **Query Handler** | Executes the read logic for one query type. |
| **Event Handler** | Reacts to a domain event (send email, update read model, etc.). |
| **Aggregate** | A domain entity that encapsulates state and emits events. |

### Data flow

```
HTTP Request
     ↓
Controller
     ↓
  ┌──────────────────────────────────────────────────────┐
  │                     Buses                            │
  │  CommandBus.execute(cmd)   QueryBus.execute(query)   │
  └──────────────────────────────────────────────────────┘
          ↓                             ↓
  Command Handler                Query Handler
          ↓                             ↓
  Write Repository              Read Repository
  (normalized DB)               (optimized views / read DB)
          ↓
  Domain Events published
          ↓
  Event Handlers
  (projections, side effects, notifications)
```

---

## 3. Commands

A **command** is a plain class that represents an intent to change system state. Commands are named in the imperative: `CreatePost`, `DeleteComment`, `FollowUser`.

### Rules for commands

- Named as imperative verbs: `CreateUser`, `PublishPost`, `SendEmail`
- Contain all data needed to perform the operation
- Return nothing (void) or only an identifier
- One command type → exactly one handler
- Should be validated before dispatch (DTO → Command)

### Command class

```ts
// posts/commands/create-post.command.ts
export class CreatePostCommand {
  constructor(
    public readonly authorId: string,
    public readonly content: string,
    public readonly imageUrl: string | null,
  ) {}
}
```

### Command handler

```ts
// posts/commands/handlers/create-post.handler.ts
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostCommand } from '../create-post.command';
import { Post } from '../../entities/post.entity';
import { PostCreatedEvent } from '../../events/post-created.event';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreatePostCommand): Promise<string> {
    const post = this.postRepository.create({
      authorId: command.authorId,
      content: command.content,
      imageUrl: command.imageUrl,
    });

    await this.postRepository.save(post);

    // Publish a domain event after the state change
    this.eventBus.publish(new PostCreatedEvent(post.id, post.authorId));

    return post.id;
  }
}
```

---

## 4. Queries

A **query** is a plain class that represents a request for data. Queries are named as nouns or questions: `GetPostById`, `GetFeedForUser`, `GetFollowers`.

### Rules for queries

- Named as nouns or questions: `GetUserById`, `ListPosts`
- Always return data — never produce side effects
- One query type → exactly one handler
- Can be optimized independently from write logic (e.g., raw SQL joins, denormalized views)

### Query class

```ts
// posts/queries/get-feed.query.ts
export class GetFeedQuery {
  constructor(
    public readonly userId: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}
```

### Query handler

```ts
// posts/queries/handlers/get-feed.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetFeedQuery } from '../get-feed.query';
import { Post } from '../../entities/post.entity';

@QueryHandler(GetFeedQuery)
export class GetFeedHandler implements IQueryHandler<GetFeedQuery> {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async execute(query: GetFeedQuery): Promise<Post[]> {
    const { userId, page, limit } = query;
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoin('follows', 'f', 'f.followingId = post.authorId AND f.followerId = :userId', { userId })
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }
}
```

---

## 5. Events

A **domain event** is a record that something happened in the domain. Events are named in the past tense: `PostCreated`, `UserFollowed`, `CommentDeleted`.

### Rules for events

- Named in past tense: `PostCreated`, `UserRegistered`
- Immutable — they describe something that already happened
- Multiple handlers can subscribe to the same event
- Used to decouple side effects from the core command handler

### Event class

```ts
// posts/events/post-created.event.ts
export class PostCreatedEvent {
  constructor(
    public readonly postId: string,
    public readonly authorId: string,
  ) {}
}
```

### Event handler

```ts
// posts/events/handlers/post-created.handler.ts
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PostCreatedEvent } from '../post-created.event';
import { NotificationsService } from '../../../notifications/notifications.service';

@EventsHandler(PostCreatedEvent)
export class PostCreatedHandler implements IEventHandler<PostCreatedEvent> {
  constructor(private readonly notifications: NotificationsService) {}

  async handle(event: PostCreatedEvent) {
    // Notify followers — side effect decoupled from the command handler
    await this.notifications.notifyFollowers(event.authorId, event.postId);
  }
}
```

Multiple handlers for the same event:

```ts
@EventsHandler(PostCreatedEvent)
export class UpdateFeedProjectionHandler implements IEventHandler<PostCreatedEvent> {
  async handle(event: PostCreatedEvent) {
    // Update a pre-computed feed cache
  }
}
```

---

## 6. Event Sourcing

Event Sourcing is a pattern often used alongside CQRS but they are independent. In Event Sourcing, state is not stored as a current snapshot — instead, the full history of events is stored, and current state is derived by replaying them.

### CQRS vs Event Sourcing

| | CQRS | Event Sourcing |
|---|---|---|
| Separates reads and writes | Yes | Optional |
| Stores history | No | Yes — full audit log |
| Rebuilds state from events | No | Yes |
| Complexity | Medium | High |
| Required together | No | No |

### When Event Sourcing is worth it

- Financial systems requiring a full audit trail
- Systems that need time-travel debugging (replay events to see past state)
- Complex domain models where every state change matters

### When to skip Event Sourcing

- Most CRUD-heavy applications (Instagram feed, profiles)
- Teams without prior Event Sourcing experience
- Performance-sensitive read paths (replaying 10k events per request is slow without snapshots)

### Snapshot pattern (optimization for Event Sourcing)

Replaying all events from the beginning is slow at scale. Snapshots periodically save the current aggregate state so only events after the snapshot need to be replayed.

```ts
// Every 50 events, save a snapshot
if (aggregate.version % 50 === 0) {
  await snapshotStore.save(aggregate.id, aggregate.state, aggregate.version);
}

// On load: restore from snapshot, then replay only newer events
const snapshot = await snapshotStore.load(aggregateId);
const events = await eventStore.loadAfter(aggregateId, snapshot.version);
aggregate.restoreFromSnapshot(snapshot);
aggregate.replay(events);
```

---

## 7. CQRS in NestJS

The `@nestjs/cqrs` package provides `CommandBus`, `QueryBus`, `EventBus`, and the decorator-based handler registration.

```bash
npm install @nestjs/cqrs
```

### Module setup

```ts
// posts/posts.module.ts
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';

// Handlers
import { CreatePostHandler } from './commands/handlers/create-post.handler';
import { DeletePostHandler } from './commands/handlers/delete-post.handler';
import { GetFeedHandler } from './queries/handlers/get-feed.handler';
import { GetPostByIdHandler } from './queries/handlers/get-post-by-id.handler';
import { PostCreatedHandler } from './events/handlers/post-created.handler';

const CommandHandlers = [CreatePostHandler, DeletePostHandler];
const QueryHandlers = [GetFeedHandler, GetPostByIdHandler];
const EventHandlers = [PostCreatedHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [...CommandHandlers, ...QueryHandlers, ...EventHandlers],
})
export class PostsModule {}
```

### Controller dispatching to buses

```ts
// posts/posts.controller.ts
import { Controller, Post, Get, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from './commands/create-post.command';
import { DeletePostCommand } from './commands/delete-post.command';
import { GetFeedQuery } from './queries/get-feed.query';
import { GetPostByIdQuery } from './queries/get-post-by-id.query';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller({ path: 'posts', version: '1' })
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@Body() dto: CreatePostDto, @CurrentUser() user: User) {
    return this.commandBus.execute(
      new CreatePostCommand(user.id, dto.content, dto.imageUrl ?? null),
    );
  }

  @Get('feed')
  getFeed(
    @CurrentUser() user: User,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.queryBus.execute(new GetFeedQuery(user.id, +page, +limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetPostByIdQuery(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commandBus.execute(new DeletePostCommand(id, user.id));
  }
}
```

---

## 8. Full Example — Posts Feature

This section shows a complete file tree and wiring for a posts feature using CQRS.

### File structure

```
posts/
├── posts.module.ts
├── posts.controller.ts
│
├── commands/
│   ├── create-post.command.ts
│   ├── delete-post.command.ts
│   └── handlers/
│       ├── create-post.handler.ts
│       └── delete-post.handler.ts
│
├── queries/
│   ├── get-feed.query.ts
│   ├── get-post-by-id.query.ts
│   └── handlers/
│       ├── get-feed.handler.ts
│       └── get-post-by-id.handler.ts
│
├── events/
│   ├── post-created.event.ts
│   ├── post-deleted.event.ts
│   └── handlers/
│       ├── post-created.handler.ts
│       └── update-feed-projection.handler.ts
│
├── dto/
│   └── create-post.dto.ts
│
└── entities/
    └── post.entity.ts
```

### `delete-post.handler.ts` — authorization inside a command handler

```ts
// posts/commands/handlers/delete-post.handler.ts
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeletePostCommand } from '../delete-post.command';
import { Post } from '../../entities/post.entity';
import { PostDeletedEvent } from '../../events/post-deleted.event';

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const post = await this.postRepository.findOneBy({ id: command.postId });
    if (!post) throw new NotFoundException();
    if (post.authorId !== command.requestingUserId) throw new ForbiddenException();

    await this.postRepository.delete(command.postId);
    this.eventBus.publish(new PostDeletedEvent(command.postId, post.authorId));
  }
}
```

### Aggregate with event publishing (advanced)

When using aggregates, events are collected on the aggregate and flushed after persistence.

```ts
// posts/aggregates/post.aggregate.ts
import { AggregateRoot } from '@nestjs/cqrs';
import { PostCreatedEvent } from '../events/post-created.event';

export class PostAggregate extends AggregateRoot {
  public id: string;
  public authorId: string;
  public content: string;

  static create(id: string, authorId: string, content: string): PostAggregate {
    const post = new PostAggregate();
    post.id = id;
    post.authorId = authorId;
    post.content = content;
    post.apply(new PostCreatedEvent(id, authorId)); // queues the event
    return post;
  }
}
```

```ts
// In a command handler using the aggregate
@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    @InjectRepository(Post) private readonly repo: Repository<Post>,
  ) {}

  async execute(command: CreatePostCommand) {
    const post = this.publisher.mergeObjectContext(
      PostAggregate.create(uuid(), command.authorId, command.content),
    );
    await this.repo.save(post);
    post.commit(); // publishes all queued events to EventBus
    return post.id;
  }
}
```

---

## 9. When to Use CQRS

### Use CQRS when

- **Read and write models diverge significantly** — your write model is normalized but your read model needs complex joins or denormalized views
- **Read load >> write load** — allows scaling read replicas independently
- **Many side effects** — events decouple notifications, projections, and audit logs from core write logic
- **Complex domain** — a rich domain with aggregates, invariants, and business rules benefits from the explicit command/event model
- **Multiple consumers of events** — microservices architecture where multiple services react to domain events

### Skip CQRS when

- Simple CRUD with no meaningful domain logic
- Team is unfamiliar with the pattern (learning curve is real)
- The same shape of data is read back immediately after writes (e.g., a simple settings page)
- You are in early-stage development — defer the pattern until the need is clear

### Gradual adoption

CQRS does not need to be applied to the entire system at once. Apply it to the features where the complexity exists. A simple users module can stay as a traditional service; a complex feed or notifications module can adopt CQRS.

---

## 10. Common Pitfalls

### Pitfall 1 — Commands returning full objects

Commands should return void or at most an ID. Returning a full entity from a command means the write model is doing read work. Issue a query after the command if you need the created resource.

```ts
// Wrong
async execute(command: CreatePostCommand): Promise<Post> { ... }

// Correct
async execute(command: CreatePostCommand): Promise<string> {
  // return the new ID only
  return post.id;
}
```

### Pitfall 2 — Business logic in the controller

The controller should only translate HTTP to commands/queries. Guards, authorization, and validation belong in guards, pipes, and command handlers — not in the controller.

### Pitfall 3 — Too many commands for simple operations

Not every field update needs its own command. `UpdateUserProfileCommand` is fine. You do not need `UpdateUserBioCommand`, `UpdateUserAvatarCommand`, and `UpdateUserUsernameCommand` for a simple profile update.

### Pitfall 4 — Synchronous event handlers blocking the command

`EventBus.publish` in `@nestjs/cqrs` is synchronous by default. If an event handler throws, it can affect the command response. For non-critical side effects, use a message queue (BullMQ, Kafka) to make events truly asynchronous.

### Pitfall 5 — Skipping the read model optimization

The main benefit of CQRS is that query handlers can use optimized read paths. If your query handlers simply call the same repository methods as your command handlers, you are adding complexity without gaining the benefit. Optimize reads independently: raw SQL, materialized views, Redis projections.

---

## 11. Cheat Sheet

### Naming conventions

```
Command:       CreatePost, DeleteComment, FollowUser     (imperative verb)
Query:         GetPostById, ListFollowers, GetFeed        (noun or Get*)
Event:         PostCreated, CommentDeleted, UserFollowed  (past tense)
Handler:       CreatePostHandler, GetFeedHandler          (matches its class)
```

### NestJS CQRS scaffolding pattern

```ts
// Command
export class DoSomethingCommand {
  constructor(public readonly payload: string) {}
}

// Handler
@CommandHandler(DoSomethingCommand)
export class DoSomethingHandler implements ICommandHandler<DoSomethingCommand> {
  async execute(command: DoSomethingCommand): Promise<void> { ... }
}

// Query
export class GetSomethingQuery {
  constructor(public readonly id: string) {}
}

// Handler
@QueryHandler(GetSomethingQuery)
export class GetSomethingHandler implements IQueryHandler<GetSomethingQuery, Something> {
  async execute(query: GetSomethingQuery): Promise<Something> { ... }
}

// Event
export class SomethingHappenedEvent {
  constructor(public readonly id: string) {}
}

// Handler
@EventsHandler(SomethingHappenedEvent)
export class SomethingHappenedHandler implements IEventHandler<SomethingHappenedEvent> {
  async handle(event: SomethingHappenedEvent): Promise<void> { ... }
}
```

### Dispatch from controller

```ts
// Command
const id = await this.commandBus.execute(new CreatePostCommand(userId, content));

// Query
const posts = await this.queryBus.execute(new GetFeedQuery(userId, page, limit));

// Event (usually published inside a command handler, not a controller)
this.eventBus.publish(new PostCreatedEvent(postId, authorId));
```

---

## References

- NestJS CQRS module: https://docs.nestjs.com/recipes/cqrs
- `@nestjs/cqrs` GitHub: https://github.com/nestjs/cqrs
- Greg Young — CQRS documents: https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf
- Martin Fowler — CQRS: https://martinfowler.com/bliki/CQRS.html
- Event Sourcing pattern: https://martinfowler.com/eaaDev/EventSourcing.html
