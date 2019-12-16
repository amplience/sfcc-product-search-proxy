import { Response } from '../src/endpoints/model/response';
export declare class SimpleResponse implements Response {
    code?: number;
    body?: any;
    status(code: number): Response;
    json(json: any): any;
}
