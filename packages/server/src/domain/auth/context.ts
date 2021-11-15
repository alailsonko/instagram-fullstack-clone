import { PubSub } from "graphql-subscriptions";

export interface ContextGraphQL {
  token: String,
  pubsub: PubSub
}
