import nock from 'nock';
import test from 'ava';
import { Request } from '../../src/endpoints/model/request';
import getToken from '../../src/endpoints/get-token';
import { SimpleResponse } from '../simple-response';

test('should succeed when valid request', async t => {
  const req: Request = {
    headers: {
      'x-auth-id': 'myId',
      'x-auth-secret': 'mySecret'
    }
  };

  const authToken = 'si324u223njnpipuh2pu3n4if';
  setUpMockServers(authToken, 200);

  const res = new SimpleResponse();

  const result = await getToken(req, res);

  t.is(result, authToken)
});

test('should return 500 and throw when bad request', async t => {
  const req: Request = {
    headers: {
      'x-auth-id': 'myId',
      'x-auth-secret': 'mySecret'
    }
  };

  const authToken = 'si324u223njnpipuh2pu3n4if';
  setUpMockServers(authToken, 400);

  const res = new SimpleResponse();
  let result;
  try {
    result = await getToken(req, res);
  } catch (e) {

  }
  t.is(res.code, 500);
  t.is(res.body.code, 'TOKEN_ERROR');
  t.is((!result), true);
});

test('should return 500 and throw when server error', async t => {
  const req: Request = {
    headers: {
      'x-auth-id': 'myId',
      'x-auth-secret': 'mySecret'
    }
  };

  const authToken = 'si324u223njnpipuh2pu3n4if';
  setUpMockServers(authToken, 504);

  const res = new SimpleResponse();
  let result;
  try {
    result = await getToken(req, res);
  } catch (e) {

  }
  t.is(res.code, 500);
  t.is(res.body.code, 'TOKEN_ERROR');
  t.is((!result), true);
});

function setUpMockServers(
    token: string,
    tokenCode: number = 200) {
  nock('https://account.demandware.com')
      .post('/dw/oauth2/access_token')
      .reply(tokenCode, {
        access_token: token,
        expires_in: 2303208
      });
}
