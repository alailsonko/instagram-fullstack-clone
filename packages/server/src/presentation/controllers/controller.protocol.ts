import { ContextGraphQL } from '../../domain/auth/context'

export interface Controller<T, K, X> {
  handle: (req: K, res: X) => Promise<T>
}
