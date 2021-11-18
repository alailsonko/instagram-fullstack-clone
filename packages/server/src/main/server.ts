import { ApolloServer, ExpressContext } from "apollo-server-express";
import express from "express";
import schema from "./graphql/schemasMap";
import dotenv from "dotenv";
import { ContextGraphQL } from "../domain/auth/context";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { createServer } from "http";
import { PubSub } from "graphql-subscriptions";
import { graphqlUploadExpress } from "graphql-upload";
import path from "path";
import { makeAuthorization } from "../presentation/factories/middleware/authorization.factory";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const server = new ApolloServer({
  uploads: false,
  schema,
  subscriptions: {
    onConnect: (connectionParams, webSocket, context) => {
      console.log("Client connected");
    },
    onDisconnect: (webSocket, context) => {
      console.log("Client disconnected");
    },
  },
  plugins: [
    {
      async serverWillStart() {
        return {
          serverWillStop() {
            console.log('hello');
            subscriptionServer.close()
          },
        };
      },
    },
  ],
  context: async ({ req }: ExpressContext): Promise<ContextGraphQL> => {
    const pubsub = new PubSub();
    const authorization = makeAuthorization();
    const [, token] = req.headers.authorization?.split(" ") ?? "";
    const [isLogged, user] = await authorization.isLogged(token);
    return { token, pubsub, isLogged, user };
  },
});

const subscriptionServer = SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
    onConnect: () => {
      return {
        pubsub: new PubSub()
      }
    }
  },
  {
    server: httpServer,
    path: server.graphqlPath,
  }
);


app.use(graphqlUploadExpress());
app.use(express.static(path.join(__dirname, "..", "uploads")));

server.applyMiddleware({ app, path: "/graphql" });

httpServer.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
  console.log(`listening ws on ${server.subscriptionsPath}`);
});
