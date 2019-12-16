import { Request } from '../model/request';
import { Response } from '../model/response';
import { Query } from '../model/query';
import { TokenSupplier } from './token-supplier';

export default function getProducts(
    req: Request,
    res: Response,
    query: Query,
    params: any,
    PAGE_SIZE: number
): Promise<boolean>;
