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
            'x-auth-secret': 'mySecret',
            endpoint: 'http://example.com'
        },
        body: {
            search_text: 'myname',
            site_id: 'mysite'
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
            'x-auth-secret': 'mySecret',
            endpoint: 'http://example2.com'
        },
        body: {
            search_text: 'myname',
            site_id: 'mysite'
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
            'x-auth-secret': 'mySecret',
            endpoint: 'http://example3.com'
        },
        body: {
            search_text: 'myname',
            site_id: 'mysite'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1zZWFyY2guc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2R1Y3Qtc2VhcmNoLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsOENBQXVCO0FBRXZCLHdGQUErRDtBQUMvRCx3REFBb0Q7QUFFcEQsYUFBSSxDQUFDLG1DQUFtQyxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtJQUNsRCxNQUFNLEdBQUcsR0FBWTtRQUNuQixPQUFPLEVBQUU7WUFDUCxXQUFXLEVBQUUsTUFBTTtZQUNuQixlQUFlLEVBQUUsVUFBVTtZQUMzQixRQUFRLEVBQUUsb0JBQW9CO1NBQy9CO1FBQ0QsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFLFFBQVE7WUFDckIsT0FBTyxFQUFFLFFBQVE7U0FDbEI7S0FDRixDQUFDO0lBRUYsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUU7WUFDdkIsRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUU7Z0JBQ0osT0FBTyxFQUFFLFFBQVE7YUFDbEI7WUFDRCxLQUFLLEVBQUUsRUFBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUM7U0FDbkMsQ0FBRSxFQUNILEdBQUcsRUFDSCxHQUFHLEVBQ0gsb0JBQW9CLENBQUMsQ0FBQztJQUUxQixNQUFNLEdBQUcsR0FBRyxJQUFJLGdDQUFjLEVBQUUsQ0FBQztJQUNqQyxNQUFNLE9BQU8sR0FBRyxJQUFJLHdCQUFhLEVBQUUsQ0FBQztJQUNwQyxNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRS9CLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUNyQixDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyxzQ0FBc0MsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDckQsTUFBTSxHQUFHLEdBQVk7UUFDbkIs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ICdhdmEnO1xuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gJy4uLy4uL3NyYy9tb2RlbC9yZXF1ZXN0JztcbmltcG9ydCBwcm9kdWN0U2VhcmNoIGZyb20gJy4uLy4uL3NyYy9lbmRwb2ludHMvcHJvZHVjdC1zZWFyY2gnO1xuaW1wb3J0IHsgU2ltcGxlUmVzcG9uc2UgfSBmcm9tICcuLi9zaW1wbGUtcmVzcG9uc2UnO1xuXG50ZXN0KCdzaG91bGQgc3VjY2VlZCB3aGVuIHZhbGlkIHJlcXVlc3QnLCBhc3luYyB0ID0+IHtcbiAgY29uc3QgcmVxOiBSZXF1ZXN0ID0ge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgICd4LWF1dGgtaWQnOiAnbXlJZCcsXG4gICAgICAneC1hdXRoLXNlY3JldCc6ICdteVNlY3JldCcsXG4gICAgICBlbmRwb2ludDogJ2h0dHA6Ly9leGFtcGxlLmNvbSdcbiAgICB9LFxuICAgIGJvZHk6IHtcbiAgICAgIHNlYXJjaF90ZXh0OiAnbXluYW1lJyxcbiAgICAgIHNpdGVfaWQ6ICdteXNpdGUnXG4gICAgfVxuICB9O1xuXG4gIHNldFVwTW9ja1NlcnZlcnMoJ215c2l0ZScsIFsge1xuICAgICAgICBpZDogMSxcbiAgICAgICAgbmFtZToge1xuICAgICAgICAgIGRlZmF1bHQ6ICdzaW1wbGUnXG4gICAgICAgIH0sXG4gICAgICAgIGltYWdlOiB7YWJzX3VybDogJ3NpbXBsZS1jYXQuanBnJ31cbiAgICAgIH0gXSxcbiAgICAgIDIwMCxcbiAgICAgIDIwMCxcbiAgICAgICdodHRwOi8vZXhhbXBsZS5jb20nKTtcblxuICBjb25zdCByZXMgPSBuZXcgU2ltcGxlUmVzcG9uc2UoKTtcbiAgY29uc3Qgc3ViamVjdCA9IG5ldyBwcm9kdWN0U2VhcmNoKCk7XG4gIGF3YWl0IHN1YmplY3Quc2VhcmNoKHJlcSwgcmVzKTtcblxuICB0LmlzKHJlcy5jb2RlLCAyMDApXG59KTtcblxudGVzdCgnc2hvdWxkIGZhaWwgd2hlbiB1bmFibGUgdG8gZ2V0IHRva2VuJywgYXN5bmMgdCA9PiB7XG4gIGNvbnN0IHJlcTogUmVxdWVzdCA9IHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICAneC1hdXRoLWlkJzogJ215SWQnLFxuICAgICAgJ3gtYXV0aC1zZWNyZXQnOiAnbXlTZWNyZXQnLFxuICAgICAgZW5kcG9pbnQ6ICdodHRwOi8vZXhhbXBsZTIuY29tJ1xuICAgIH0sXG4gICAgYm9keToge1xuICAgICAgc2VhcmNoX3RleHQ6ICdteW5hbWUnLFxuICAgICAgc2l0ZV9pZDogJ215c2l0ZSdcbiAgICB9XG4gIH07XG5cbiAgc2V0VXBNb2NrU2VydmVycygnbXlzaXRlJywgWyB7XG4gICAgICAgIGlkOiAxLFxuICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgZGVmYXVsdDogJ3NpbXBsZSdcbiAgICAgICAgfSxcbiAgICAgICAgaW1hZ2U6IHthYnNfdXJsOiAnc2ltcGxlLWNhdC5qcGcnfVxuICAgICAgfSBdLCA0MDMsXG4gICAgICAyMDAsXG4gICAgICAnaHR0cDovL2V4YW1wbGUyLmNvbScpO1xuXG4gIGNvbnN0IHJlcyA9IG5ldyBTaW1wbGVSZXNwb25zZSgpO1xuICBjb25zdCBzdWJqZWN0ID0gbmV3IHByb2R1Y3RTZWFyY2goKTtcbiAgYXdhaXQgc3ViamVjdC5zZWFyY2gocmVxLCByZXMpO1xuXG4gIHQuaXMocmVzLmNvZGUsIDUwMCk7XG4gIHQuaXMocmVzLmJvZHkuY29kZSwgJ1RPS0VOX0VSUk9SJyk7XG59KTtcblxudGVzdCgnc2hvdWxkIGZhaWwgd2hlbiB1bmFibGUgdG8gZ2V0IHJlc3BvbnNlIGZyb20gc2ZjYycsIGFzeW5jIHQgPT4ge1xuICBjb25zdCByZXE6IFJlcXVlc3QgPSB7XG4gICAgaGVhZGVyczoge1xuICAgICAgJ3gtYXV0aC1pZCc6ICdteUlkJyxcbiAgICAgICd4LWF1dGgtc2VjcmV0JzogJ215U2VjcmV0JyxcbiAgICAgIGVuZHBvaW50OiAnaHR0cDovL2V4YW1wbGUzLmNvbSdcbiAgICB9LFxuICAgIGJvZHk6IHtcbiAgICAgIHNlYXJjaF90ZXh0OiAnbXluYW1lJyxcbiAgICAgIHNpdGVfaWQ6ICdteXNpdGUnXG4gICAgfVxuICB9O1xuXG4gIHNldFVwTW9ja1NlcnZlcnMoJ215c2l0ZScsIFsge1xuICAgICAgICBpZDogMSxcbiAgICAgICAgbmFtZToge1xuICAgICAgICAgIGRlZmF1bHQ6ICdzaW1wbGUnXG4gICAgICAgIH0sXG4gICAgICAgIGltYWdlOiB7YWJzX3VybDogJ3NpbXBsZS1jYXQuanBnJ31cbiAgICAgIH0gXSxcbiAgICAgIDIwMCxcbiAgICAgIDUwNCxcbiAgICAgICdodHRwOi8vZXhhbXBsZTMuY29tJyk7XG5cbiAgY29uc3QgcmVzID0gbmV3IFNpbXBsZVJlc3BvbnNlKCk7XG4gIGNvbnN0IHN1YmplY3QgPSBuZXcgcHJvZHVjdFNlYXJjaCgpO1xuICBhd2FpdCBzdWJqZWN0LnNlYXJjaChyZXEsIHJlcyk7XG5cbiAgdC5pcyhyZXMuY29kZSwgNTAwKTtcbiAgdC5pcyhyZXMuYm9keS5jb2RlLCAnUFJPRFVDVF9TRUFSQ0hfRVJST1InKTtcbn0pO1xuXG5mdW5jdGlvbiBzZXRVcE1vY2tTZXJ2ZXJzKFxuICAgIHNpdGVJZDogc3RyaW5nLFxuICAgIHJlc3VsdHM6IGFueVtdLFxuICAgIHRva2VuQ29kZTogbnVtYmVyID0gMjAwLFxuICAgIHNmY2NDb2RlOiBudW1iZXIgPSAyMDAsXG4gICAgc2VydmVyUGF0aDogc3RyaW5nKSB7XG4gIG5vY2soJ2h0dHBzOi8vYWNjb3VudC5kZW1hbmR3YXJlLmNvbScpXG4gICAgICAucG9zdCgnL2R3L29hdXRoMi9hY2Nlc3NfdG9rZW4nKVxuICAgICAgLnJlcGx5KHRva2VuQ29kZSwge1xuICAgICAgICBhY2Nlc3NfdG9rZW46ICdteVRva2VuJyxcbiAgICAgICAgZXhwaXJlc19pbjogMjMwMzIwOFxuICAgICAgfSk7XG5cbiAgbm9jayhzZXJ2ZXJQYXRoKVxuICAgICAgLnBvc3QoYC9zLy0vZHcvZGF0YS92MTlfMTAvcHJvZHVjdF9zZWFyY2g/c2l0ZV9pZD0keyBzaXRlSWQgfWApXG4gICAgICAucmVwbHkoc2ZjY0NvZGUsIHtcbiAgICAgICAgaGl0czogcmVzdWx0cyxcbiAgICAgICAgdG90YWw6IHJlc3VsdHMubGVuZ3RoXG4gICAgICB9KTtcblxufVxuXG5cbiJdfQ==