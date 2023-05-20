import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Comment {
  @Field((type) => Int)
  id: number;

  @Field()
  content: string;
}
