import { Response } from '../endpoints/model/response';

export class SimpleResponse implements Response {
  public code?: number;
  public body?: any;

  status(code: number): Response {
    console.log(`got value set in resp`);
    this.code = code;
    return this;
  }

  json(json: any): any {
    this.body = json;
    return this;
  }
}
