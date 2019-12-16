import { Request } from './model/request';
import { Response } from './model/response';
export declare type TokenSupplier = (req: Request, res: Response) => Promise<any>;
