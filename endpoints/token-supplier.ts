import { Request } from './model/request.js';
import { Response } from './model/response';

export type TokenSupplier = (req: Request, res: Response) => Promise<any>;

