# API Architecture (DDD + gRPC Orchestration)

## Purpose

This document describes a Domain-Driven Design (DDD) architecture for the `packages/api` service in this repository.

The API service is intended to be an **orchestrator microservice**, not a choreography-based event bus. It receives client requests and coordinates multiple backend services through **gRPC calls**.

## Goals

- Keep business rules in domain concepts.
- Make the API project a clear orchestrator for flows across services.
- Avoid coupling domain logic to transport or gRPC concerns.
- Organize code in layers and bounded contexts.
- Make integration with other services explicit, reliable, and testable.

## High-level architecture

The API service should be structured into the following logical layers:

1. **API / Interface Layer**
   - HTTP controllers, REST routes, GraphQL resolvers, validation, request DTOs.
   - Receives client input and forwards it to the application layer.

2. **Application Layer**
   - Use cases / application services.
   - Orchestrates workflows.
   - Calls domain services, repositories, and gRPC adapters.
   - Translates between inbound DTOs and domain models.

3. **Domain Layer**
   - Entities, value objects, aggregates, domain services, domain events, invariants.
   - Contains pure business rules and behaviors.
   - No direct dependency on NestJS, gRPC or HTTP.

4. **Infrastructure Layer**
   - gRPC clients, repository implementations, persistence adapters, external service adapters.
   - Implements interfaces defined in the domain/application layers.
   - Maps transport-layer models to domain models.

## Recommended folder structure

Use a `module-per-domain` organization, for example:

```
packages/api/src/
  modules/
    posts/
      controllers/
      dto/
      use-cases/
      services/
      domain/
        aggregates/
        entities/
        value-objects/
        events/
      infra/
        grpc/
        repositories/
    users/
      ...
    notifications/
      ...
  shared/
    grpc/
    kernel/
      base-application.service.ts
      base-domain-entity.ts
    dto/
    errors/
    types/
  main.ts
  app.module.ts
```

## Bounded contexts and modules

Treat each domain boundary as a bounded context inside the API service.

Examples:

- `posts` context: orchestrates post creation, timeline queries, media metadata, search.
- `users` context: orchestrates profile data, follow/unfollow, privacy settings.
- `comments` context: orchestrates comment flow.
- `notifications` or `feeds` context: orchestrates alert delivery and activity feed updates.

Each bounded context should contain its own domain concepts and application services.

## Orchestration style (not choreography)

This API service should be the coordinator of flows.

### Orchestration behavior

- Client sends a request to API.
- API executes an application service / use case.
- The use case calls multiple remote services via gRPC in a defined order.
- API aggregates responses and returns the final result to the client.
- Errors are handled in the application layer and translated to appropriate API responses.

### Why orchestration

- The API knows the user's request intent and owns the process flow.
- It can make cross-service decisions, retries, rollout control, and conditional logic.
- It avoids implicit business behavior hidden in event consumers.

### What to avoid

- Avoid relying on remote services to react indirectly to events in order to complete the same request.
- Avoid turning the API into a pure passive proxy with no application-level coordination.
- Avoid letting remote services decide the workflow order for multi-step requests.

## gRPC communication

Since this API service communicates with other services by gRPC, treat each remote service as an infrastructure adapter.

### gRPC contract

- Define `.proto` contracts for each service boundary.
- Generate typed clients and DTOs from proto definitions.
- Keep proto messages aligned with domain intent but not necessarily with database models.

### gRPC adapter pattern

Create adapters in the infra layer, for example:

- `PostsGrpcClientAdapter implements PostRepositoryInterface`
- `UsersGrpcClientAdapter implements UserDataProvider`
- `NotificationsGrpcClientAdapter implements NotificationPublisher`

The application layer depends on interfaces, not concrete gRPC clients.

### Example gRPC flow

For `CreatePostUseCase`:

1. Validate input in the controller.
2. Build a domain command or request object.
3. Call `CreatePostService.execute(command)`.
4. Inside the use case:
   - call `userService.getProfile(userId)` via gRPC to confirm permissions.
   - call `mediaService.uploadMedia(...)` via gRPC if needed.
   - call `postsService.createPost(...)` via gRPC.
   - call `notificationsService.notifyFollowers(...)` via gRPC.
5. Return the composed response.

This is orchestration: the API service decides the order and handles cross-service coordination.

## Domain layer responsibilities

The domain layer should include:

- **Entities**: `User`, `Post`, `Comment`, `Feed`, ...
- **Value Objects**: `PostId`, `UserId`, `Caption`, `ImageUrl`, `Timestamp`.
- **Aggregates**: groups of entities with transactional consistency, e.g. `PostAggregate`.
- **Domain Services**: business operations that do not naturally belong to a single entity.
- **Domain Events**: internal events for analytics, audit, or local side effects.

Example domain rule:

- A post cannot be created with a private account unless the author is allowed to post.
- A follow request can only be accepted if both users exist and follow rules are satisfied.

The API service should perform domain validation and coordination, while the remote services own their own data and invariants.

## Application layer responsibilities

The application layer contains use-case classes such as:

- `CreatePostUseCase`
- `FollowUserUseCase`
- `GetHomeFeedUseCase`
- `CommentOnPostUseCase`

Responsibilities:

- Orchestrate end-to-end flows
- Compose calls to domain services and gRPC adapters
- Handle retries, compensation, and error translation
- Convert protocol DTOs to domain objects and back

It should not contain detailed persistence or transport code.

## Infrastructure layer responsibilities

The infrastructure layer is where gRPC and external systems live.

Responsibilities:

- gRPC client setup and configuration
- HTTP adapter wiring if needed
- Repository and adapter implementations
- Persistence details if API stores local state
- Mapping gRPC responses to domain objects

If the API needs local persistence for cache or orchestration state, keep it isolated in infrastructure.

## Example module pattern in NestJS

```ts
@Module({
  imports: [
    ClientsModule.register([...grpc clients...]),
  ],
  controllers: [PostsController],
  providers: [
    CreatePostUseCase,
    PostDomainService,
    PostsGrpcClientAdapter,
    UsersGrpcClientAdapter,
  ],
})
export class PostsModule {}
```

## Dependency rules

- Domain layer: depends on nothing external.
- Application layer: depends on domain and shared abstractions.
- Infrastructure layer: depends on application/domain abstractions and Nest/NPM packages.
- Controllers: depend on application layer only.
- gRPC clients: depend on infrastructure abstractions only.

## Orchestration vs choreography in practice

### Orchestrator microservice

This API service should:

- implement business workflows explicitly
- request remote behavior synchronously or in a controlled async pattern
- keep the workflow logic in application services
- publish events only for observability or decoupled side effects, not as the main business flow

### Choreography pattern

In a choreography design, services react to events and coordinate themselves indirectly.

For this API service, that is not the primary design choice. The API is the process owner for client requests.

## Recommended design decisions

- Use DDD for the API’s internal business model and use cases.
- Use `src/modules/<context>` for each domain area.
- Keep gRPC clients in `src/modules/<context>/infra/grpc` or `src/shared/grpc`.
- Use interfaces for external service dependencies.
- Keep controllers thin and delegate orchestration to application services.
- Use protobuf-generated types for gRPC contracts.
- Log and trace gRPC orchestration flows for debugging.

## Example orchestration use case

### Use case: `PublishPost`

1. Controller receives request with user, caption, media.
2. `PublishPostUseCase`:
   - verifies author data via `UsersGrpcAdapter`
   - validates business rules through a `Post` aggregate
   - calls `MediaGrpcAdapter.upload()` if needed
   - calls `PostsGrpcAdapter.createPost()`
   - calls `NotificationsGrpcAdapter.broadcastNewPost()`
3. Returns final post view to the client.

This flow is orchestrated in the API service itself.

## When to keep logic in remote services

The API should orchestrate but not duplicate deep domain behavior of other microservices.

The API may delegate to remote services for:

- post persistence and post-specific invariants
- user profile management
- notification dispatch
- search indexing

The API should only implement cross-service business workflows and coordination.

## Testing strategy

- Unit test domain rules independently.
- Unit test use cases with mocked gRPC adapters.
- Use integration tests for the full gRPC orchestration path if the remote services are available.
- Keep transport and protocol tests separate from domain behavior tests.

## Summary

The API service should be a DDD-based orchestrator:

- Domain objects define business intent.
- Application services manage workflows.
- Infrastructure adapters provide gRPC access.
- The API owns request orchestration, not remote-service choreography.

This structure keeps the API project maintainable, testable, and aligned with your requirement that it be an orchestrator microservice communicating by gRPC.
