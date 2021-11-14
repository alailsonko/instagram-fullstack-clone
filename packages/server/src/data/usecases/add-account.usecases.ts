import { Prisma, User } from "@prisma/client";
import { Object } from "ts-toolbelt";
import HashPassword from "../../infra/cryptography/hash-password.cryptography";
import UserRepository from "../../infra/repositories/users/users.repositories";

type ResponseUser = Object.Omit<User, "password">;
type ResponseDB = Object.Optional<User, "password">;

interface IAddAccount {
  add(data: Prisma.UserCreateInput): Promise<ResponseUser>;
}

class AddAccount implements IAddAccount {
  private hashPassword: HashPassword;
  private userRepository: UserRepository;
  constructor(hashPassword: HashPassword, userRepository: UserRepository) {
    (this.hashPassword = hashPassword), (this.userRepository = userRepository);
  }
  async add(data: Prisma.UserCreateInput): Promise<ResponseUser> {
    const hashedPassword = await this.hashPassword.encrypt(data.password);
    data.password = hashedPassword;
    const response = (await this.userRepository.create(data)) as ResponseDB;
    if (response && response.password) {
      delete response.password;
    }
    return response;
  }
}

export default AddAccount;
