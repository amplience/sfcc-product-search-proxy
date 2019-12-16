export interface Response {
  status(code: number): Response;

  json(json: any): any;
}
