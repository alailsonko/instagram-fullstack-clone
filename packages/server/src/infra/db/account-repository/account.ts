import { AddAccountRepository } from '../../../data/protocols/add-account-repository.protocol'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { AccountModel } from '../../../domain/models/account'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class AccountPGRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    await prisma.user.create({
      data: accountData
    })
    return await new Promise((resolve, reject) => {
      return resolve({
        id: '1',
        email: 'prisma@example.com',
        name: 'prisma',
        password: 'prisma'
      })
    })
  }
}
