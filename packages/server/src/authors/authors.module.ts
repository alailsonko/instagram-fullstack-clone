import { Module } from '@nestjs/common';
import { PostsModule } from 'src/posts/posts.module';
import { AuthorsResolver } from './authors.resolver';
import { AuthorsService } from './services/authors.service';

@Module({
  imports: [PostsModule],
  providers: [AuthorsService, AuthorsResolver],
})
export class AuthorsModule {}
