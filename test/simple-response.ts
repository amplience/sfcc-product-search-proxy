import { Response } from '../src/endpoints/model/response';

export class SimpleResponse implements Response {
  public code?: number;
  public body?: any;

  status(code: number): Response {
    this.code = code;
    return this;
  }

  json(json: any): any {
    this.body = json;
    return this;
  }
}
