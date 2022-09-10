import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { GraphQLDate } from 'graphql-iso-date'
import { globalIdField } from 'graphql-relay'
import { ContextGraphQL } from '../../../domain/auth/context'
import { File, Post, Media, User } from '../generated'

export const FileType = new GraphQLObjectType({
  name: 'File',
  fields: () => ({
    filename: {
      type: GraphQLString,
      resolve: (file: File) => file.filename,
    },
    mimetype: {
      type: GraphQLString,
      resolve: (file: File) => file.mimetype,
    },
    encoding: {
      type: GraphQLString,
      resolve: (file: File) => file.encoding,
    },
  }),
})

export const MediaType = new GraphQLObjectType({
  name: 'Media',
  fields: () => ({
    idSerial: {
      type: GraphQLInt,
      resolve: (media: Media) => media.idSerial,
    },
    id: globalIdField('Media', (post: Post) => post.id),
    postId: {
      type: GraphQLInt,
      resolve: (media: Media) => media.postId,
    },
    url: {
      type: GraphQLString,
      resolve: (media: Media) => media.url,
    },
    createdAt: {
      type: GraphQLDate,
      resolve: (media: Media) => media.createdAt,
    },
    updatedAt: {
      type: GraphQLDate,
      resolve: (media: Media) => media.updatedAt,
    },
  }),
})

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    idSerial: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: (user: User) => user.idSerial,
    },
    id: globalIdField('User', (post: Post) => post.id),
    username: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (user: User) => user.username,
    },
    email: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (user: User) => user.email,
    },
    createdAt: {
      type: GraphQLDate,
      resolve: (user: User) => user.createdAt,
    },
    updatedAt: {
      type: GraphQLDate,
      resolve: (user: User) => user.updatedAt,
    },
  }),
})

export const PostType = new GraphQLObjectType<Post, ContextGraphQL>({
  name: 'Post',
  fields: () => ({
    idSerial: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: (post: Post) => post.idSerial,
    },
    userId: {
      type: GraphQLInt,
      resolve: (post: Post) => post.userId,
    },
    id: globalIdField('Post', (post: Post) => post.id),
    description: {
      type: GraphQLString,
      resolve: (post: Post) => post.description,
    },
    user: {
      type: UserType,
      resolve: (post: Post) => post.user,
    },
    medias: {
      type: GraphQLList(MediaType),
      resolve: (post: Post) => post.medias,
    },
    createdAt: {
      type: GraphQLDate,
      resolve: (post: Post) => post.createdAt,
    },
    updatedAt: {
      type: GraphQLDate,
      resolve: (post: Post) => post.updatedAt,
    },
  }),
})

export const AuthenticateResponseType = new GraphQLObjectType({
  name: 'AuthenticateResponse',
  fields: () => ({
    token: {
      type: GraphQLString,
    },
    user: {
      type: UserType,
    },
  }),
})
