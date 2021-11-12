import { ContextGraphQL } from '../../domain/auth/context'

export interface Controller<T, K> {
  handle: (req: K, res: ContextGraphQL) => Promise<T>
}
