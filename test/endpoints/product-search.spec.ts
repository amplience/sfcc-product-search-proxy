import nock from 'nock';
import test from 'ava';
import { Request } from '../../src/endpoints/model/request';
import productSearch from '../../src/endpoints/product-search';
import { SimpleResponse } from '../simple-response';

test('should succeed when valid request', async t => {
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
      200,
      'http://example.com');

  const res = new SimpleResponse();
  const subject = new productSearch();
  await subject.search(req, res);

  t.is(res.code, 200)
});

test('should fail when unable to get token', async t => {
  const req: Request = {
    headers: {
      'x-auth-id': 'myId',
      'x-auth-secret': 'mySecret'
    },
    body: {
      search_text: 'myname',
      site_id: 'mysite',
      endpoint: 'http://example2.com'
    }
  };

  setUpMockServers('mysite', [ {
    id: 1,
    name: {
      default: 'simple'
    },
    image: {abs_url: 'simple-cat.jpg'}
  } ], 403,
      200,
      'http://example2.com');

  const res = new SimpleResponse();
  const subject = new productSearch();
  await subject.search(req, res);

  t.is(res.code, 500);
  t.is(res.body.code, 'TOKEN_ERROR');
});

test('should fail when unable to get response from sfcc', async t => {
  const req: Request = {
    headers: {
      'x-auth-id': 'myId',
      'x-auth-secret': 'mySecret'
    },
    body: {
      search_text: 'myname',
      site_id: 'mysite',
      endpoint: 'http://example3.com'
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
      504,
      'http://example3.com');

  const res = new SimpleResponse();
  const subject = new productSearch();
  await subject.search(req, res);

  t.is(res.code, 500);
  t.is(res.body.code, 'PRODUCT_SEARCH_ERROR');
});

function setUpMockServers(
    siteId: string,
    results: any[],
    tokenCode: number = 200,
    sfccCode: number = 200,
    serverPath: string) {
  nock('https://account.demandware.com')
      .post('/dw/oauth2/access_token')
      .reply(tokenCode, {
        access_token: 'myToken',
        expires_in: 2303208
      });

  nock(serverPath)
      .post(`/s/-/dw/data/v19_10/product_search?site_id=${ siteId }`)
      .reply(sfccCode, {
        hits: results,
        total: results.length
      });

}


