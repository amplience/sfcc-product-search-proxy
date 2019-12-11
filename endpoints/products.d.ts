import { TokenSupplier } from './token-supplier.js';
import { Request } from './model/request.js';
import { Response } from './model/response.js';

export default class products {
  constructor(tokenSupplier: TokenSupplier);

  find(req: Request, res: Response): void;
}
