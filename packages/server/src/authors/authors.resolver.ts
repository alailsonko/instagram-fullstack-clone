import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Post } from 'src/posts/models/post.model';
import { PostsService } from 'src/posts/services/posts.service';
import { Author } from './models/author.model';
import { AuthorsService } from './services/authors.service';
import { Comment } from 'src/comments/models/comment.model';
import { CommentsService } from 'src/comments/services/comments.service';

@Resolver((of) => Author)
export class AuthorsResolver {
  constructor(
    private authorsService: AuthorsService,
    private postsService: PostsService,
    private commentsService: CommentsService,
    private pubSub: PubSub,
  ) {
    this.pubSub = new PubSub();
  }
  @Query((returns) => Author, { name: 'author' })
  async author(@Args('id', { type: () => Int }) id: number) {
    return this.authorsService.findOneById(id);
  }

  @ResolveField('posts', (returns) => [Post])
  async posts(@Parent() author: Author) {
    const { id } = author;
    return this.postsService.findAll({ authorId: id });
  }

  @Mutation((returns) => Post, { name: 'upvotePost' })
  async upvotePost(@Args({ name: 'postId', type: () => Int }) postId: number) {
    return this.postsService.upvoteById({ id: postId });
  }

  @Mutation((returns) => Post)
  async addComment(
    @Args('postId', { type: () => Int }) postId: number,
    @Args('comment', { type: () => Comment }) comment: string,
  ) {
    const newComment = this.commentsService.addComment({ id: postId, comment });
    this.pubSub.publish('commentAdded', { commentAdded: newComment });
    return newComment;
  }

  @Subscription((returns) => Comment, {
    name: 'commentAdded',
  })
  commentAdded() {
    return this.pubSub.asyncIterator('commentAdded');
  }
}
