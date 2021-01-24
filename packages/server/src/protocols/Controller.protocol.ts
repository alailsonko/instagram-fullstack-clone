import { HttpRequest, HttpResponse } from '../protocols/http.protocol'

export interface Controller {
    handle(req: HttpRequest): HttpResponse
}

