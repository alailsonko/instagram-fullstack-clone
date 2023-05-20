import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthorsModule } from './authors/authors.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    PostsModule,
    AuthorsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      subscriptions: {
        'graphql-ws': true,
      },
      include: [PostsModule, AuthorsModule],
    }),
  ],
})
export class AppModule {}
