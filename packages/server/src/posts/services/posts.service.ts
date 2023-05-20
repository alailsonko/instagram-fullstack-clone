import { Injectable } from '@nestjs/common';
import { Post } from '../models/post.model';

@Injectable()
export class PostsService {
  findAll({ authorId }: { authorId: number }): Post[] {
    return [
      {
        id: authorId,
        title: 'some title',
        votes: 12,
      },
    ];
  }

  upvoteById({ id }: { id: number }): Post {
    return {
      id,
      title: 'some',
      votes: 3,
    };
  }
}
