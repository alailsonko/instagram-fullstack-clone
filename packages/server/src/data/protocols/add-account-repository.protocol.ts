import { AddAccountModel, AccountModel } from '../usecases/add-account/db-add-account.protocol'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
