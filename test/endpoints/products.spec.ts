import nock from 'nock';
import test from 'ava';
import { Request } from '../../endpoints/model/request';
import getToken from '../../endpoints/get-token';
import { SimpleResponse } from '../simple-response';
import products from '../../endpoints/products.js';

test('find products by Id should fail when sfcc returns 500', async t => {
  const req: Request = {
    headers: {
      'x-auth-id': 'myId',
      'x-auth-secret': 'mySecret'
    },
    query: {
      ids: [ 1 ],
      site_id: 'mysite',
      endpoint: 'http://example.com'
    }
  };

  setUpMockServers('mysite', [ {
        id: 1,
        name: {
          default: 'simple'
        },
        image: {abs_url: 'simple-cat.jpg'}
      } ],
      200,
      504);

  const res = new SimpleResponse();
  const subject = new products(getToken);
  await subject.find(req, res);

  t.is(res.code, 500);
  t.is(res.body.code, 'PRODUCT_SEARCH_ERROR');
});

function setUpMockServers(
    siteId: string,
    results: any[],
    tokenCode: number = 200,
    sfccCode: number = 200) {
  nock('https://account.demandware.com')
      .post('/dw/oauth2/access_token')
      .reply(tokenCode, {
        access_token: 'myToken',
        expires_in: 2303208
      });

  nock('http://example.com')
      .post(`/s/-/dw/data/v19_10/product_search?site_id=${ siteId }`)
      .reply(sfccCode, {
        hits: results,
        total: results.length
      });
}
