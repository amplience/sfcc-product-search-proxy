import { Response } from './model/response';
import { Request } from './model/request';
import { TokenSupplier } from './token-supplier';

export default class productSearch {
  constructor(tokenSupplier: TokenSupplier);

  search(req: Request, res: Response): void;
}
