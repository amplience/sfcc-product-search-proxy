import nock from 'nock';
import test from 'ava';
import { Response } from '../../endpoints/model/response';
import { Request } from '../../endpoints/model/request';
import productSearch from '../../endpoints/product-search';
import getToken from '../../endpoints/get-token';

// test('should succeed when valid request', async t => {
//   const req: Request = {
//     headers: {
//       'x-auth-id': 'myId',
//       'x-auth-secret': 'mySecret'
//     },
//     body: {
//       search_text: 'myname',
//       site_id: 'mysite',
//       endpoint: 'http://example.com'
//     }
//   };
//
//   setUpMockServers('mysite', [ {
//     id: 1,
//     name: {
//       default: 'simple'
//     },
//     image: {abs_url: 'simple-cat.jpg'}
//   } ]);
//
//   const res = new SimpleResponse();
//   const subject = new productSearch(getToken);
//   await subject.search(req, res);
//
//   t.is(res.code, 200)
// });

// test.serial('should fail when unable to get token', async t => {
//   const req: Request = {
//     headers: {
//       'x-auth-id': 'myId',
//       'x-auth-secret': 'mySecret'
//     },
//     body: {
//       search_text: 'myname',
//       site_id: 'mysite',
//       endpoint: 'http://example.com'
//     }
//   };
//
//   setUpMockServers('mysite', [ {
//     id: 1,
//     name: {
//       default: 'simple'
//     },
//     image: {abs_url: 'simple-cat.jpg'}
//   } ], 403);
//
//   const res = new SimpleResponse();
//   const subject = new productSearch(getToken);
//   await subject.search(req, res);
//
//   t.is(res.code, 500);
//   t.is(res.body.code, 'TOKEN_ERROR');
// });

test.serial('should fail when unable to get response from sfcc', async t => {
  const req: Request = {
    headers: {
      'x-auth-id': 'myId',
      'x-auth-secret': 'mySecret'
    },
    body: {
      search_text: 'myname',
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
  const subject = new productSearch(getToken);
  await subject.search(req, res);

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

class SimpleResponse implements Response {
  public code?: number;
  public body?: any;

  status(code: number): Response {
    console.log(`got value set in resp`);
    this.code = code;
    return this;
  }

  json(json: any): any {
    this.body = json;
    return this;
  }
}
