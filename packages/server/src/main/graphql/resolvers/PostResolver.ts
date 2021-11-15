import { IResolvers } from 'graphql-tools'
import {
  MutationCreatePostArgs,
  File
} from '../generated'
import {
  GraphQLUpload,
  FileUpload
} from 'graphql-upload'
import { finished } from 'stream/promises'
import path from 'path'

export const PostResolvers: IResolvers = {
  // Query: {
  //   async login (
  //     _: undefined,
  //     args: QueryLoginArgs,
  //     ctx
  //   ) {
  //     const signinController = makeSignInController()
  //     return await signinController.handle(args, ctx)
  //   }
  // },    
  Upload: GraphQLUpload,
  Mutation: {
    async createPost (
      _: undefined,
      args: MutationCreatePostArgs,
      ctx
    ): Promise<File> {
     const files = args.file as FileUpload[]
     for await (const file of files ) {
       const {  createReadStream, filename, mimetype, encoding } = file
       // Invoking the `createReadStream` will return a Readable Stream.
      // See https://nodejs.org/api/stream.html#stream_readable_streams
      const stream = createReadStream();

      // This is purely for demonstration purposes and will overwrite the
      // local-file-output.txt in the current working directory on EACH upload.
      const __dirname = path.resolve()
      const out = require('fs').createWriteStream(__dirname + filename);
      stream.pipe(out);
      await finished(out);
      // return await signupController.handle(args, ctx)

      // return { filename, mimetype, encoding };     
     }  
     return {
       filename: 'somename',
       encoding: 'some',
       mimetype: 'some'
     }
    }
  }
}
