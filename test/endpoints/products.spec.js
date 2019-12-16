"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nock_1 = __importDefault(require("nock"));
const ava_1 = __importDefault(require("ava"));
const simple_response_1 = require("../simple-response");
const products_1 = __importDefault(require("../../src/endpoints/products"));
ava_1.default('should succeed when valid get by ids request', async (t) => {
    const req = {
        headers: {
            'x-auth-id': 'myId',
            'x-auth-secret': 'mySecret',
            endpoint: 'http://example1.com'
        },
        query: {
            ids: [1],
            site_id: 'mysite'
        }
    };
    setUpMockServers('mysite', [{
            id: 1,
            name: {
                default: 'simple'
            },
            image: { abs_url: 'simple-cat.jpg' }
        }], 200, 200, 'http://example1.com');
    const res = new simple_response_1.SimpleResponse();
    const subject = new products_1.default();
    await subject.find(req, res);
    t.is(res.code, 200);
});
ava_1.default('should fail when unable to get token when finding by id', async (t) => {
    const req = {
        headers: {
            'x-auth-id': 'myId',
            'x-auth-secret': 'mySecret',
            endpoint: 'http://example1.com'
        },
        query: {
            ids: [1],
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
    const subject = new products_1.default();
    await subject.find(req, res);
    t.is(res.code, 500);
    t.is(res.body.code, 'TOKEN_ERROR');
});
ava_1.default('find products by Id should fail when sfcc returns 500', async (t) => {
    const req = {
        headers: {
            'x-auth-id': 'myId',
            'x-auth-secret': 'mySecret',
            endpoint: 'http://example.com'
        },
        query: {
            ids: [1],
            site_id: 'mysite'
        }
    };
    setUpMockServers('mysite', [{
            id: 1,
            name: {
                default: 'simple'
            },
            image: { abs_url: 'simple-cat.jpg' }
        }], 200, 504, 'http://example.com');
    const res = new simple_response_1.SimpleResponse();
    const subject = new products_1.default();
    await subject.find(req, res);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2R1Y3RzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsOENBQXVCO0FBRXZCLHdEQUFvRDtBQUNwRCw0RUFBb0Q7QUFFcEQsYUFBSSxDQUFDLDhDQUE4QyxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtJQUM3RCxNQUFNLEdBQUcsR0FBWTtRQUNuQixPQUFPLEVBQUU7WUFDUCxXQUFXLEVBQUUsTUFBTTtZQUNuQixlQUFlLEVBQUUsVUFBVTtZQUMzQixRQUFRLEVBQUUscUJBQXFCO1NBQ2hDO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsR0FBRyxFQUFFLENBQUUsQ0FBQyxDQUFFO1lBQ1YsT0FBTyxFQUFFLFFBQVE7U0FDbEI7S0FDRixDQUFDO0lBRUYsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUU7WUFDdkIsRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUU7Z0JBQ0osT0FBTyxFQUFFLFFBQVE7YUFDbEI7WUFDRCxLQUFLLEVBQUUsRUFBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUM7U0FDbkMsQ0FBRSxFQUNILEdBQUcsRUFDSCxHQUFHLEVBQ0gscUJBQXFCLENBQUMsQ0FBQztJQUUzQixNQUFNLEdBQUcsR0FBRyxJQUFJLGdDQUFjLEVBQUUsQ0FBQztJQUNqQyxNQUFNLE9BQU8sR0FBRyxJQUFJLGtCQUFRLEVBQUUsQ0FBQztJQUMvQixNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRTdCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUNyQixDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyx5REFBeUQsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDeEUsTUFBTSxHQUFHLEdBQVk7UUFDbkIsT0FB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bXBvcnQgdGVzdCBmcm9tICdhdmEnO1xuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gJy4uLy4uL3NyYy9tb2RlbC9yZXF1ZXN0JztcbmltcG9ydCB7IFNpbXBsZVJlc3BvbnNlIH0gZnJvbSAnLi4vc2ltcGxlLXJlc3BvbnNlJztcbmltcG9ydCBwcm9kdWN0cyBmcm9tICcuLi8uLi9zcmMvZW5kcG9pbnRzL3Byb2R1Y3RzJztcblxudGVzdCgnc2hvdWxkIHN1Y2NlZWQgd2hlbiB2YWxpZCBnZXQgYnkgaWRzIHJlcXVlc3QnLCBhc3luYyB0ID0+IHtcbiAgY29uc3QgcmVxOiBSZXF1ZXN0ID0ge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgICd4LWF1dGgtaWQnOiAnbXlJZCcsXG4gICAgICAneC1hdXRoLXNlY3JldCc6ICdteVNlY3JldCcsXG4gICAgICBlbmRwb2ludDogJ2h0dHA6Ly9leGFtcGxlMS5jb20nXG4gICAgfSxcbiAgICBxdWVyeToge1xuICAgICAgaWRzOiBbIDEgXSxcbiAgICAgIHNpdGVfaWQ6ICdteXNpdGUnXG4gICAgfVxuICB9O1xuXG4gIHNldFVwTW9ja1NlcnZlcnMoJ215c2l0ZScsIFsge1xuICAgICAgICBpZDogMSxcbiAgICAgICAgbmFtZToge1xuICAgICAgICAgIGRlZmF1bHQ6ICdzaW1wbGUnXG4gICAgICAgIH0sXG4gICAgICAgIGltYWdlOiB7YWJzX3VybDogJ3NpbXBsZS1jYXQuanBnJ31cbiAgICAgIH0gXSxcbiAgICAgIDIwMCxcbiAgICAgIDIwMCxcbiAgICAgICdodHRwOi8vZXhhbXBsZTEuY29tJyk7XG5cbiAgY29uc3QgcmVzID0gbmV3IFNpbXBsZVJlc3BvbnNlKCk7XG4gIGNvbnN0IHN1YmplY3QgPSBuZXcgcHJvZHVjdHMoKTtcbiAgYXdhaXQgc3ViamVjdC5maW5kKHJlcSwgcmVzKTtcblxuICB0LmlzKHJlcy5jb2RlLCAyMDApXG59KTtcblxudGVzdCgnc2hvdWxkIGZhaWwgd2hlbiB1bmFibGUgdG8gZ2V0IHRva2VuIHdoZW4gZmluZGluZyBieSBpZCcsIGFzeW5jIHQgPT4ge1xuICBjb25zdCByZXE6IFJlcXVlc3QgPSB7XG4gICAgaGVhZGVyczoge1xuICAgICAgJ3gtYXV0aC1pZCc6ICdteUlkJyxcbiAgICAgICd4LWF1dGgtc2VjcmV0JzogJ215U2VjcmV0JyxcbiAgICAgIGVuZHBvaW50OiAnaHR0cDovL2V4YW1wbGUxLmNvbSdcbiAgICB9LFxuICAgIHF1ZXJ5OiB7XG4gICAgICBpZHM6IFsgMSBdLFxuICAgICAgc2l0ZV9pZDogJ215c2l0ZSdcbiAgICB9XG4gIH07XG5cbiAgc2V0VXBNb2NrU2VydmVycygnbXlzaXRlJywgWyB7XG4gICAgICAgIGlkOiAxLFxuICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgZGVmYXVsdDogJ3NpbXBsZSdcbiAgICAgICAgfSxcbiAgICAgICAgaW1hZ2U6IHthYnNfdXJsOiAnc2ltcGxlLWNhdC5qcGcnfVxuICAgICAgfSBdLCA0MDMsXG4gICAgICAyMDAsXG4gICAgICAnaHR0cDovL2V4YW1wbGUyLmNvbScpO1xuXG4gIGNvbnN0IHJlcyA9IG5ldyBTaW1wbGVSZXNwb25zZSgpO1xuICBjb25zdCBzdWJqZWN0ID0gbmV3IHByb2R1Y3RzKCk7XG4gIGF3YWl0IHN1YmplY3QuZmluZChyZXEsIHJlcyk7XG5cbiAgdC5pcyhyZXMuY29kZSwgNTAwKTtcbiAgdC5pcyhyZXMuYm9keS5jb2RlLCAnVE9LRU5fRVJST1InKTtcbn0pO1xuXG50ZXN0KCdmaW5kIHByb2R1Y3RzIGJ5IElkIHNob3VsZCBmYWlsIHdoZW4gc2ZjYyByZXR1cm5zIDUwMCcsIGFzeW5jIHQgPT4ge1xuICBjb25zdCByZXE6IFJlcXVlc3QgPSB7XG4gICAgaGVhZGVyczoge1xuICAgICAgJ3gtYXV0aC1pZCc6ICdteUlkJyxcbiAgICAgICd4LWF1dGgtc2VjcmV0JzogJ215U2VjcmV0JyxcbiAgICAgIGVuZHBvaW50OiAnaHR0cDovL2V4YW1wbGUuY29tJ1xuICAgIH0sXG4gICAgcXVlcnk6IHtcbiAgICAgIGlkczogWyAxIF0sXG4gICAgICBzaXRlX2lkOiAnbXlzaXRlJ1xuICAgIH1cbiAgfTtcblxuICBzZXRVcE1vY2tTZXJ2ZXJzKCdteXNpdGUnLCBbIHtcbiAgICAgICAgaWQ6IDEsXG4gICAgICAgIG5hbWU6IHtcbiAgICAgICAgICBkZWZhdWx0OiAnc2ltcGxlJ1xuICAgICAgICB9LFxuICAgICAgICBpbWFnZToge2Fic191cmw6ICdzaW1wbGUtY2F0LmpwZyd9XG4gICAgICB9IF0sXG4gICAgICAyMDAsXG4gICAgICA1MDQsXG4gICAgICAnaHR0cDovL2V4YW1wbGUuY29tJyk7XG5cbiAgY29uc3QgcmVzID0gbmV3IFNpbXBsZVJlc3BvbnNlKCk7XG4gIGNvbnN0IHN1YmplY3QgPSBuZXcgcHJvZHVjdHMoKTtcbiAgYXdhaXQgc3ViamVjdC5maW5kKHJlcSwgcmVzKTtcblxuICB0LmlzKHJlcy5jb2RlLCA1MDApO1xuICB0LmlzKHJlcy5ib2R5LmNvZGUsICdQUk9EVUNUX1NFQVJDSF9FUlJPUicpO1xufSk7XG5cbmZ1bmN0aW9uIHNldFVwTW9ja1NlcnZlcnMoXG4gICAgc2l0ZUlkOiBzdHJpbmcsXG4gICAgcmVzdWx0czogYW55W10sXG4gICAgdG9rZW5Db2RlOiBudW1iZXIgPSAyMDAsXG4gICAgc2ZjY0NvZGU6IG51bWJlciA9IDIwMCxcbiAgICBzZXJ2ZXJQYXRoOiBzdHJpbmcpIHtcbiAgbm9jaygnaHR0cHM6Ly9hY2NvdW50LmRlbWFuZHdhcmUuY29tJylcbiAgICAgIC5wb3N0KCcvZHcvb2F1dGgyL2FjY2Vzc190b2tlbicpXG4gICAgICAucmVwbHkodG9rZW5Db2RlLCB7XG4gICAgICAgIGFjY2Vzc190b2tlbjogJ215VG9rZW4nLFxuICAgICAgICBleHBpcmVzX2luOiAyMzAzMjA4XG4gICAgICB9KTtcblxuICBub2NrKHNlcnZlclBhdGgpXG4gICAgICAucG9zdChgL3MvLS9kdy9kYXRhL3YxOV8xMC9wcm9kdWN0X3NlYXJjaD9zaXRlX2lkPSR7IHNpdGVJZCB9YClcbiAgICAgIC5yZXBseShzZmNjQ29kZSwge1xuICAgICAgICBoaXRzOiByZXN1bHRzLFxuICAgICAgICB0b3RhbDogcmVzdWx0cy5sZW5ndGhcbiAgICAgIH0pO1xuXG59XG4iXX0=