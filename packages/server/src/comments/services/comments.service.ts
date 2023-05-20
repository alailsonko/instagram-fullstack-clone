import { Injectable } from '@nestjs/common';
import { Comment } from '../models/comment.model';

@Injectable()
export class CommentsService {
  addComment({ id, comment }: { id: number; comment: string }): Comment {
    return {
      content: comment,
      id: id,
    };
  }
}
