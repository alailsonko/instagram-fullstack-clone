import { PubSub } from "graphql-subscriptions";

export interface ContextGraphQL {
  token: string,
  pubsub: PubSub
}
