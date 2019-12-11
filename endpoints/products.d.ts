import { TokenSupplier } from './token-supplier';
import { Request } from './model/request';
import { Response } from './model/response';

export default class products {
  constructor(tokenSupplier: TokenSupplier);

  find(req: Request, res: Response): void;
}
