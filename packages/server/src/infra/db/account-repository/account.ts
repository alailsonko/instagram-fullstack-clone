import { AddAccountRepository } from '../../../data/protocols/add-account-repository.protocol'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { AccountModel } from '../../../domain/models/account'
import { Context } from '../context'

export default class AccountPGRepository implements AddAccountRepository {
  private readonly ctx: Context
  constructor (ctx: Context) {
    this.ctx = ctx
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await this.ctx.prisma.user.create({
      data: accountData
    })
  }
}
