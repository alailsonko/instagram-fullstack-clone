import path from 'path';
import grpc, { credentials, ServiceError } from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import type {
  AuthServiceClient,
  CreateAccountRequest,
  CreateAccountResponse,
  VerifyAccountRequest,
  VerifyAccountResponse,
} from '../generated/auth';

const AUTH_PROTO_PATH = path.join(__dirname, '../../proto/auth.proto');
const packageDefinition = protoLoader.loadSync(AUTH_PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDefinition) as unknown as {
  instagram: {
    auth: {
      AuthService: grpc.ServiceClientConstructor;
    };
  };
};

const AuthService = grpcObject.instagram.auth.AuthService;

export class AuthClient {
  private readonly client: AuthServiceClient;

  constructor(address: string, creds = credentials.createInsecure()) {
    this.client = new AuthService(address, creds) as unknown as AuthServiceClient;
  }

  async createAccount(request: CreateAccountRequest): Promise<CreateAccountResponse> {
    return this.callUnaryMethod<CreateAccountRequest, CreateAccountResponse>(
      'CreateAccount',
      request,
    );
  }

  async verifyAccount(request: VerifyAccountRequest): Promise<VerifyAccountResponse> {
    return this.callUnaryMethod<VerifyAccountRequest, VerifyAccountResponse>(
      'VerifyAccount',
      request,
    );
  }

  private callUnaryMethod<Req, Res>(
    methodName: keyof AuthServiceClient,
    request: Req,
  ): Promise<Res> {
    return new Promise<Res>((resolve, reject) => {
      const method = (this.client as any)[methodName];
      if (typeof method !== 'function') {
        return reject(new Error(`gRPC method ${String(methodName)} not found`));
      }

      method.call(this.client, request, (err: ServiceError | null, response: Res) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }
}
