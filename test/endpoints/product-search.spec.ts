import { expect } from 'chai';
import { Response } from '../../endpoints/model/response';
import productSearch from '../../endpoints/product-search';

describe('product search', () => {
  it('should succeed when valid request', () => {
    let req = {
      headers: {
        'x-auth-id': 'myId',
        'x-auth-secret': 'mySecret'
      }
    };
    let res = new SimpleResponse();

    expect(productSearch(req, res)).is.undefined;
  });

});

class SimpleResponse implements Response {
  public code?: number;

  status(code: number): Response {
    this.code = code;
    return this;
  }
}
