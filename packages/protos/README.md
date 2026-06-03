# @instagram-clone/protos

Shared gRPC proto package for the Instagram clone backend.

This package contains:

- `proto/` for `.proto` service definitions
- generated TypeScript types under `src/generated`
- async/await-friendly gRPC client wrappers under `src/auth`

## Available commands

```bash
yarn workspace @instagram-clone/protos generate
yarn workspace @instagram-clone/protos build
```

## Auth service

The auth proto defines an `AuthService` with these RPC methods:

- `CreateAccount(CreateAccountRequest) returns (CreateAccountResponse)`
- `VerifyAccount(VerifyAccountRequest) returns (VerifyAccountResponse)`

You can use the async client from `@instagram-clone/protos`:

```ts
import { AuthClient } from '@instagram-clone/protos';

const authClient = new AuthClient('localhost:50051');
await authClient.createAccount({ email: 'a@example.com', password: 'secret' });
```
