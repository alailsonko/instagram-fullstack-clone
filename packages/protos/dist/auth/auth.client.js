"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthClient = void 0;
const path_1 = __importDefault(require("path"));
const grpc_js_1 = __importStar(require("@grpc/grpc-js"));
const proto_loader_1 = __importDefault(require("@grpc/proto-loader"));
const AUTH_PROTO_PATH = path_1.default.join(__dirname, '../../proto/auth.proto');
const packageDefinition = proto_loader_1.default.loadSync(AUTH_PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const grpcObject = grpc_js_1.default.loadPackageDefinition(packageDefinition);
const AuthService = grpcObject.instagram.auth.AuthService;
class AuthClient {
    client;
    constructor(address, creds = grpc_js_1.credentials.createInsecure()) {
        this.client = new AuthService(address, creds);
    }
    async createAccount(request) {
        return this.callUnaryMethod('CreateAccount', request);
    }
    async verifyAccount(request) {
        return this.callUnaryMethod('VerifyAccount', request);
    }
    callUnaryMethod(methodName, request) {
        return new Promise((resolve, reject) => {
            const method = this.client[methodName];
            if (typeof method !== 'function') {
                return reject(new Error(`gRPC method ${String(methodName)} not found`));
            }
            method.call(this.client, request, (err, response) => {
                if (err) {
                    return reject(err);
                }
                resolve(response);
            });
        });
    }
}
exports.AuthClient = AuthClient;
//# sourceMappingURL=auth.client.js.map