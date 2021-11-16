import { ApolloServer, ExpressContext } from "apollo-server-express";
import express from "express";
import schema from "./graphql/schemasMap";
import dotenv from "dotenv";
import { ContextGraphQL } from "../domain/auth/context";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { createServer } from "http";
import { PubSub } from 'graphql-subscriptions'
import {
  graphqlUploadExpress
} from 'graphql-upload'
import path from "path";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const server = new ApolloServer({
  uploads: false, 
  schema,
  plugins: [
    {
      async serverWillStart() {
        return {
          serverWillStop() {
            subscriptionServer.close();
          },
        };
      },
    },
  ],
  context: ({ req }: ExpressContext): ContextGraphQL => {
    const pubsub = new PubSub()
    const [,token] = req.headers.authorization?.split(' ') ?? "";
    return { token, pubsub };
  },
});

const subscriptionServer = SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
  },
  {
    server: httpServer,
    path: server.graphqlPath,
  }
);
app.use(graphqlUploadExpress())
app.use(express.static(path.join(__dirname, '..', 'uploads')))

server.applyMiddleware({ app, path: "/graphql" });

app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});
