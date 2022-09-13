export interface Controller<TReturn, KRequest, XResponse> {
  handle: (req: KRequest, res: XResponse) => Promise<TReturn>
}
