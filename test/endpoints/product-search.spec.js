"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nock_1 = __importDefault(require("nock"));
const ava_1 = __importDefault(require("ava"));
const product_search_1 = __importDefault(require("../../src/endpoints/product-search"));
const simple_response_1 = require("../simple-response");
ava_1.default('should succeed when valid request', async (t) => {
    const req = {
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
    setUpMockServers('mysite', [{
            id: 1,
            name: {
                default: 'simple'
            },
            image: { abs_url: 'simple-cat.jpg' }
        }], 200, 200, 'http://example.com');
    const res = new simple_response_1.SimpleResponse();
    const subject = new product_search_1.default();
    await subject.search(req, res);
    t.is(res.code, 200);
});
ava_1.default('should fail when unable to get token', async (t) => {
    const req = {
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
    setUpMockServers('mysite', [{
            id: 1,
            name: {
                default: 'simple'
            },
            image: { abs_url: 'simple-cat.jpg' }
        }], 403, 200, 'http://example2.com');
    const res = new simple_response_1.SimpleResponse();
    const subject = new product_search_1.default();
    await subject.search(req, res);
    t.is(res.code, 500);
    t.is(res.body.code, 'TOKEN_ERROR');
});
ava_1.default('should fail when unable to get response from sfcc', async (t) => {
    const req = {
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
    setUpMockServers('mysite', [{
            id: 1,
            name: {
                default: 'simple'
            },
            image: { abs_url: 'simple-cat.jpg' }
        }], 200, 504, 'http://example3.com');
    const res = new simple_response_1.SimpleResponse();
    const subject = new product_search_1.default();
    await subject.search(req, res);
    t.is(res.code, 500);
    t.is(res.body.code, 'PRODUCT_SEARCH_ERROR');
});
function setUpMockServers(siteId, results, tokenCode = 200, sfccCode = 200, serverPath) {
    nock_1.default('https://account.demandware.com')
        .post('/dw/oauth2/access_token')
        .reply(tokenCode, {
        access_token: 'myToken',
        expires_in: 2303208
    });
    nock_1.default(serverPath)
        .post(`/s/-/dw/data/v19_10/product_search?site_id=${siteId}`)
        .reply(sfccCode, {
        hits: results,
        total: results.length
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1zZWFyY2guc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2R1Y3Qtc2VhcmNoLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsOENBQXVCO0FBRXZCLHdGQUErRDtBQUMvRCx3REFBb0Q7QUFFcEQsYUFBSSxDQUFDLG1DQUFtQyxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtJQUNsRCxNQUFNLEdBQUcsR0FBWTtRQUNuQixPQUFPLEVBQUU7WUFDUCxXQUFXLEVBQUUsTUFBTTtZQUNuQixlQUFlLEVBQUUsVUFBVTtTQUM1QjtRQUNELElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRSxRQUFRO1lBQ3JCLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLFFBQVEsRUFBRSxvQkFBb0I7U0FDL0I7S0FDRixDQUFDO0lBRUYsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUU7WUFDM0IsRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUU7Z0JBQ0osT0FBTyxFQUFFLFFBQVE7YUFDbEI7WUFDRCxLQUFLLEVBQUUsRUFBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUM7U0FDbkMsQ0FBRSxFQUNDLEdBQUcsRUFDSCxHQUFHLEVBQ0gsb0JBQW9CLENBQUMsQ0FBQztJQUUxQixNQUFNLEdBQUcsR0FBRyxJQUFJLGdDQUFjLEVBQUUsQ0FBQztJQUNqQyxNQUFNLE9BQU8sR0FBRyxJQUFJLHdCQUFhLEVBQUUsQ0FBQztJQUNwQyxNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRS9CLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUNyQixDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyxzQ0FBc0MsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDckQsTUFBTSxHQUFHLEdBQVk7UUFDbkIs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ICdhdmEnO1xuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gJy4uLy4uL3NyYy9lbmRwb2ludHMvbW9kZWwvcmVxdWVzdCc7XG5pbXBvcnQgcHJvZHVjdFNlYXJjaCBmcm9tICcuLi8uLi9zcmMvZW5kcG9pbnRzL3Byb2R1Y3Qtc2VhcmNoJztcbmltcG9ydCB7IFNpbXBsZVJlc3BvbnNlIH0gZnJvbSAnLi4vc2ltcGxlLXJlc3BvbnNlJztcblxudGVzdCgnc2hvdWxkIHN1Y2NlZWQgd2hlbiB2YWxpZCByZXF1ZXN0JywgYXN5bmMgdCA9PiB7XG4gIGNvbnN0IHJlcTogUmVxdWVzdCA9IHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICAneC1hdXRoLWlkJzogJ215SWQnLFxuICAgICAgJ3gtYXV0aC1zZWNyZXQnOiAnbXlTZWNyZXQnXG4gICAgfSxcbiAgICBib2R5OiB7XG4gICAgICBzZWFyY2hfdGV4dDogJ215bmFtZScsXG4gICAgICBzaXRlX2lkOiAnbXlzaXRlJyxcbiAgICAgIGVuZHBvaW50OiAnaHR0cDovL2V4YW1wbGUuY29tJ1xuICAgIH1cbiAgfTtcblxuICBzZXRVcE1vY2tTZXJ2ZXJzKCdteXNpdGUnLCBbIHtcbiAgICBpZDogMSxcbiAgICBuYW1lOiB7XG4gICAgICBkZWZhdWx0OiAnc2ltcGxlJ1xuICAgIH0sXG4gICAgaW1hZ2U6IHthYnNfdXJsOiAnc2ltcGxlLWNhdC5qcGcnfVxuICB9IF0sXG4gICAgICAyMDAsXG4gICAgICAyMDAsXG4gICAgICAnaHR0cDovL2V4YW1wbGUuY29tJyk7XG5cbiAgY29uc3QgcmVzID0gbmV3IFNpbXBsZVJlc3BvbnNlKCk7XG4gIGNvbnN0IHN1YmplY3QgPSBuZXcgcHJvZHVjdFNlYXJjaCgpO1xuICBhd2FpdCBzdWJqZWN0LnNlYXJjaChyZXEsIHJlcyk7XG5cbiAgdC5pcyhyZXMuY29kZSwgMjAwKVxufSk7XG5cbnRlc3QoJ3Nob3VsZCBmYWlsIHdoZW4gdW5hYmxlIHRvIGdldCB0b2tlbicsIGFzeW5jIHQgPT4ge1xuICBjb25zdCByZXE6IFJlcXVlc3QgPSB7XG4gICAgaGVhZGVyczoge1xuICAgICAgJ3gtYXV0aC1pZCc6ICdteUlkJyxcbiAgICAgICd4LWF1dGgtc2VjcmV0JzogJ215U2VjcmV0J1xuICAgIH0sXG4gICAgYm9keToge1xuICAgICAgc2VhcmNoX3RleHQ6ICdteW5hbWUnLFxuICAgICAgc2l0ZV9pZDogJ215c2l0ZScsXG4gICAgICBlbmRwb2ludDogJ2h0dHA6Ly9leGFtcGxlMi5jb20nXG4gICAgfVxuICB9O1xuXG4gIHNldFVwTW9ja1NlcnZlcnMoJ215c2l0ZScsIFsge1xuICAgIGlkOiAxLFxuICAgIG5hbWU6IHtcbiAgICAgIGRlZmF1bHQ6ICdzaW1wbGUnXG4gICAgfSxcbiAgICBpbWFnZToge2Fic191cmw6ICdzaW1wbGUtY2F0LmpwZyd9XG4gIH0gXSwgNDAzLFxuICAgICAgMjAwLFxuICAgICAgJ2h0dHA6Ly9leGFtcGxlMi5jb20nKTtcblxuICBjb25zdCByZXMgPSBuZXcgU2ltcGxlUmVzcG9uc2UoKTtcbiAgY29uc3Qgc3ViamVjdCA9IG5ldyBwcm9kdWN0U2VhcmNoKCk7XG4gIGF3YWl0IHN1YmplY3Quc2VhcmNoKHJlcSwgcmVzKTtcblxuICB0LmlzKHJlcy5jb2RlLCA1MDApO1xuICB0LmlzKHJlcy5ib2R5LmNvZGUsICdUT0tFTl9FUlJPUicpO1xufSk7XG5cbnRlc3QoJ3Nob3VsZCBmYWlsIHdoZW4gdW5hYmxlIHRvIGdldCByZXNwb25zZSBmcm9tIHNmY2MnLCBhc3luYyB0ID0+IHtcbiAgY29uc3QgcmVxOiBSZXF1ZXN0ID0ge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgICd4LWF1dGgtaWQnOiAnbXlJZCcsXG4gICAgICAneC1hdXRoLXNlY3JldCc6ICdteVNlY3JldCdcbiAgICB9LFxuICAgIGJvZHk6IHtcbiAgICAgIHNlYXJjaF90ZXh0OiAnbXluYW1lJyxcbiAgICAgIHNpdGVfaWQ6ICdteXNpdGUnLFxuICAgICAgZW5kcG9pbnQ6ICdodHRwOi8vZXhhbXBsZTMuY29tJ1xuICAgIH1cbiAgfTtcblxuICBzZXRVcE1vY2tTZXJ2ZXJzKCdteXNpdGUnLCBbIHtcbiAgICAgICAgaWQ6IDEsXG4gICAgICAgIG5hbWU6IHtcbiAgICAgICAgICBkZWZhdWx0OiAnc2ltcGxlJ1xuICAgICAgICB9LFxuICAgICAgICBpbWFnZToge2Fic191cmw6ICdzaW1wbGUtY2F0LmpwZyd9XG4gICAgICB9IF0sXG4gICAgICAyMDAsXG4gICAgICA1MDQsXG4gICAgICAnaHR0cDovL2V4YW1wbGUzLmNvbScpO1xuXG4gIGNvbnN0IHJlcyA9IG5ldyBTaW1wbGVSZXNwb25zZSgpO1xuICBjb25zdCBzdWJqZWN0ID0gbmV3IHByb2R1Y3RTZWFyY2goKTtcbiAgYXdhaXQgc3ViamVjdC5zZWFyY2gocmVxLCByZXMpO1xuXG4gIHQuaXMocmVzLmNvZGUsIDUwMCk7XG4gIHQuaXMocmVzLmJvZHkuY29kZSwgJ1BST0RVQ1RfU0VBUkNIX0VSUk9SJyk7XG59KTtcblxuZnVuY3Rpb24gc2V0VXBNb2NrU2VydmVycyhcbiAgICBzaXRlSWQ6IHN0cmluZyxcbiAgICByZXN1bHRzOiBhbnlbXSxcbiAgICB0b2tlbkNvZGU6IG51bWJlciA9IDIwMCxcbiAgICBzZmNjQ29kZTogbnVtYmVyID0gMjAwLFxuICAgIHNlcnZlclBhdGg6IHN0cmluZykge1xuICBub2NrKCdodHRwczovL2FjY291bnQuZGVtYW5kd2FyZS5jb20nKVxuICAgICAgLnBvc3QoJy9kdy9vYXV0aDIvYWNjZXNzX3Rva2VuJylcbiAgICAgIC5yZXBseSh0b2tlbkNvZGUsIHtcbiAgICAgICAgYWNjZXNzX3Rva2VuOiAnbXlUb2tlbicsXG4gICAgICAgIGV4cGlyZXNfaW46IDIzMDMyMDhcbiAgICAgIH0pO1xuXG4gIG5vY2soc2VydmVyUGF0aClcbiAgICAgIC5wb3N0KGAvcy8tL2R3L2RhdGEvdjE5XzEwL3Byb2R1Y3Rfc2VhcmNoP3NpdGVfaWQ9JHsgc2l0ZUlkIH1gKVxuICAgICAgLnJlcGx5KHNmY2NDb2RlLCB7XG4gICAgICAgIGhpdHM6IHJlc3VsdHMsXG4gICAgICAgIHRvdGFsOiByZXN1bHRzLmxlbmd0aFxuICAgICAgfSk7XG5cbn1cblxuXG4iXX0=