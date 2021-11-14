import { PrismaClient } from "@prisma/client";
import AddAccount from "../../data/usecases/add-account.usecases";
import HashPassword from "../../infra/cryptography/hash-password.cryptography";
import UserRepository from "../../infra/repositories/users.repositories";
import SignUpController from "../controllers/signup.controller";

function makeSignUpController() {
  const prisma = new PrismaClient()
  const hashPassword = new HashPassword()
  const userRepository = new UserRepository(prisma)
  const addAccount = new AddAccount(hashPassword, userRepository)
  const signupController = new SignUpController(addAccount)
  return signupController
}

export default makeSignUpController
