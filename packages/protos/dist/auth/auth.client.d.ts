import grpc from '@grpc/grpc-js';
import type { CreateAccountRequest, CreateAccountResponse, VerifyAccountRequest, VerifyAccountResponse } from '../generated/auth';
export declare class AuthClient {
    private readonly client;
    constructor(address: string, creds?: grpc.ChannelCredentials);
    createAccount(request: CreateAccountRequest): Promise<CreateAccountResponse>;
    verifyAccount(request: VerifyAccountRequest): Promise<VerifyAccountResponse>;
    private callUnaryMethod;
}
