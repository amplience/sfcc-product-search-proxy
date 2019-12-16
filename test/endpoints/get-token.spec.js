"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nock_1 = __importDefault(require("nock"));
const ava_1 = __importDefault(require("ava"));
const get_token_1 = __importDefault(require("../../src/endpoints/get-token"));
const simple_response_1 = require("../simple-response");
ava_1.default('should succeed when valid request', async (t) => {
    const req = {
        headers: {
            'x-auth-id': 'myId',
            'x-auth-secret': 'mySecret',
            endpoint: 'http://simple'
        }
    };
    const authToken = 'si324u223njnpipuh2pu3n4if';
    setUpMockServers(authToken, 200);
    const res = new simple_response_1.SimpleResponse();
    const result = await get_token_1.default(req, res);
    t.is(result, authToken);
});
ava_1.default('should return 500 and throw when bad request', async (t) => {
    const req = {
        headers: {
            'x-auth-id': 'myId',
            'x-auth-secret': 'mySecret',
            endpoint: 'http://simple'
        }
    };
    const authToken = 'si324u223njnpipuh2pu3n4if';
    setUpMockServers(authToken, 400);
    const res = new simple_response_1.SimpleResponse();
    let result;
    try {
        result = await get_token_1.default(req, res);
    }
    catch (e) {
    }
    t.is(res.code, 500);
    t.is(res.body.code, 'TOKEN_ERROR');
    t.is((!result), true);
});
ava_1.default('should return 500 and throw when server error', async (t) => {
    const req = {
        headers: {
            'x-auth-id': 'myId',
            'x-auth-secret': 'mySecret',
            endpoint: 'http://simple'
        }
    };
    const authToken = 'si324u223njnpipuh2pu3n4if';
    setUpMockServers(authToken, 504);
    const res = new simple_response_1.SimpleResponse();
    let result;
    try {
        result = await get_token_1.default(req, res);
    }
    catch (e) {
    }
    t.is(res.code, 500);
    t.is(res.body.code, 'TOKEN_ERROR');
    t.is((!result), true);
});
function setUpMockServers(token, tokenCode = 200) {
    nock_1.default('https://account.demandware.com')
        .post('/dw/oauth2/access_token')
        .reply(tokenCode, {
        access_token: token,
        expires_in: 2303208
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXRva2VuLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnZXQtdG9rZW4uc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUF3QjtBQUN4Qiw4Q0FBdUI7QUFFdkIsOEVBQXFEO0FBQ3JELHdEQUFvRDtBQUVwRCxhQUFJLENBQUMsbUNBQW1DLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQ2xELE1BQU0sR0FBRyxHQUFZO1FBQ25CLE9BQU8sRUFBRTtZQUNQLFdBQVcsRUFBRSxNQUFNO1lBQ25CLGVBQWUsRUFBRSxVQUFVO1lBQzNCLFFBQVEsRUFBRSxlQUFlO1NBQzFCO0tBQ0YsQ0FBQztJQUVGLE1BQU0sU0FBUyxHQUFHLDJCQUEyQixDQUFDO0lBQzlDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUVqQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGdDQUFjLEVBQUUsQ0FBQztJQUVqQyxNQUFNLE1BQU0sR0FBRyxNQUFNLG1CQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRXhDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0FBQ3pCLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLDhDQUE4QyxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtJQUM3RCxNQUFNLEdBQUcsR0FBWTtRQUNuQixPQUFPLEVBQUU7WUFDUCxXQUFXLEVBQUUsTUFBTTtZQUNuQixlQUFlLEVBQUUsVUFBVTtZQUMzQixRQUFRLEVBQUUsZUFBZTtTQUMxQjtLQUNGLENBQUM7SUFFRixNQUFNLFNBQVMsR0FBRywyQkFBMkIsQ0FBQztJQUM5QyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxnQ0FBYyxFQUFFLENBQUM7SUFDakMsSUFBSSxNQUFNLENBQUM7SUFDWCxJQUFJO1FBQ0YsTUFBTSxHQUFHLE1BQU0sbUJBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDbkM7SUFBQyxPQUFPLENBQUMsRUFBRTtLQUVYO0lBQ0QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDeEIsQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMsK0NBQStDLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQzlELE1BQU0sR0FBRyxHQUFZO1FBQ25CLE9BQU8sRUFBRTtZQUNQLFdBQVcsRUFBRSxNQUFNO1lBQ25CLGVBQWUsRUFBRSxVQUFVO1lBQzNCLFFBQVEsRUFBRSxlQUFlO1NBQzFCO0tBQ0YsQ0FBQztJQUVGLE1BQU0sU0FBUyxHQUFHLDJCQUEyQixDQUFDO0lBQzlDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUVqQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGdDQUFjLEVBQUUsQ0FBQztJQUNqQyxJQUFJLE1BQU0sQ0FBQztJQUNYLElBQUk7UUFDRixNQUFNLEdBQUcsTUFBTSxtQkFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNuQztJQUFDLE9BQU8sQ0FBQyxFQUFFO0tBRVg7SUFDRCxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN4QixDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsZ0JBQWdCLENBQ3JCLEtBQWEsRUFDYixZQUFvQixHQUFHO0lBQ3pCLGNBQUksQ0FBQyxnQ0FBZ0MsQ0FBQztTQUNqQyxJQUFJLENBQUMseUJBQXlCLENBQUM7U0FDL0IsS0FBSyxDQUFDLFNBQVMsRUFBRTtRQUNoQixZQUFZLEVBQUUsS0FBSztRQUNuQixVQUFVLEVBQUUsT0FBTztLQUNwQixDQUFDLENBQUM7QUFDVCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5vY2sgZnJvbSAnbm9jayc7XG5pbXBvcnQgdGVzdCBmcm9tICdhdmEnO1xuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gJy4uLy4uL3NyYy9lbmRwb2ludHMvbW9kZWwvcmVxdWVzdCc7XG5pbXBvcnQgZ2V0VG9rZW4gZnJvbSAnLi4vLi4vc3JjL2VuZHBvaW50cy9nZXQtdG9rZW4nO1xuaW1wb3J0IHsgU2ltcGxlUmVzcG9uc2UgfSBmcm9tICcuLi9zaW1wbGUtcmVzcG9uc2UnO1xuXG50ZXN0KCdzaG91bGQgc3VjY2VlZCB3aGVuIHZhbGlkIHJlcXVlc3QnLCBhc3luYyB0ID0+IHtcbiAgY29uc3QgcmVxOiBSZXF1ZXN0ID0ge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgICd4LWF1dGgtaWQnOiAnbXlJZCcsXG4gICAgICAneC1hdXRoLXNlY3JldCc6ICdteVNlY3JldCcsXG4gICAgICBlbmRwb2ludDogJ2h0dHA6Ly9zaW1wbGUnXG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGF1dGhUb2tlbiA9ICdzaTMyNHUyMjNuam5waXB1aDJwdTNuNGlmJztcbiAgc2V0VXBNb2NrU2VydmVycyhhdXRoVG9rZW4sIDIwMCk7XG5cbiAgY29uc3QgcmVzID0gbmV3IFNpbXBsZVJlc3BvbnNlKCk7XG5cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZ2V0VG9rZW4ocmVxLCByZXMpO1xuXG4gIHQuaXMocmVzdWx0LCBhdXRoVG9rZW4pXG59KTtcblxudGVzdCgnc2hvdWxkIHJldHVybiA1MDAgYW5kIHRocm93IHdoZW4gYmFkIHJlcXVlc3QnLCBhc3luYyB0ID0+IHtcbiAgY29uc3QgcmVxOiBSZXF1ZXN0ID0ge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgICd4LWF1dGgtaWQnOiAnbXlJZCcsXG4gICAgICAneC1hdXRoLXNlY3JldCc6ICdteVNlY3JldCcsXG4gICAgICBlbmRwb2ludDogJ2h0dHA6Ly9zaW1wbGUnXG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGF1dGhUb2tlbiA9ICdzaTMyNHUyMjNuam5waXB1aDJwdTNuNGlmJztcbiAgc2V0VXBNb2NrU2VydmVycyhhdXRoVG9rZW4sIDQwMCk7XG5cbiAgY29uc3QgcmVzID0gbmV3IFNpbXBsZVJlc3BvbnNlKCk7XG4gIGxldCByZXN1bHQ7XG4gIHRyeSB7XG4gICAgcmVzdWx0ID0gYXdhaXQgZ2V0VG9rZW4ocmVxLCByZXMpO1xuICB9IGNhdGNoIChlKSB7XG5cbiAgfVxuICB0LmlzKHJlcy5jb2RlLCA1MDApO1xuICB0LmlzKHJlcy5ib2R5LmNvZGUsICdUT0tFTl9FUlJPUicpO1xuICB0LmlzKCghcmVzdWx0KSwgdHJ1ZSk7XG59KTtcblxudGVzdCgnc2hvdWxkIHJldHVybiA1MDAgYW5kIHRocm93IHdoZW4gc2VydmVyIGVycm9yJywgYXN5bmMgdCA9PiB7XG4gIGNvbnN0IHJlcTogUmVxdWVzdCA9IHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICAneC1hdXRoLWlkJzogJ215SWQnLFxuICAgICAgJ3gtYXV0aC1zZWNyZXQnOiAnbXlTZWNyZXQnLFxuICAgICAgZW5kcG9pbnQ6ICdodHRwOi8vc2ltcGxlJ1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhdXRoVG9rZW4gPSAnc2kzMjR1MjIzbmpucGlwdWgycHUzbjRpZic7XG4gIHNldFVwTW9ja1NlcnZlcnMoYXV0aFRva2VuLCA1MDQpO1xuXG4gIGNvbnN0IHJlcyA9IG5ldyBTaW1wbGVSZXNwb25zZSgpO1xuICBsZXQgcmVzdWx0O1xuICB0cnkge1xuICAgIHJlc3VsdCA9IGF3YWl0IGdldFRva2VuKHJlcSwgcmVzKTtcbiAgfSBjYXRjaCAoZSkge1xuXG4gIH1cbiAgdC5pcyhyZXMuY29kZSwgNTAwKTtcbiAgdC5pcyhyZXMuYm9keS5jb2RlLCAnVE9LRU5fRVJST1InKTtcbiAgdC5pcygoIXJlc3VsdCksIHRydWUpO1xufSk7XG5cbmZ1bmN0aW9uIHNldFVwTW9ja1NlcnZlcnMoXG4gICAgdG9rZW46IHN0cmluZyxcbiAgICB0b2tlbkNvZGU6IG51bWJlciA9IDIwMCkge1xuICBub2NrKCdodHRwczovL2FjY291bnQuZGVtYW5kd2FyZS5jb20nKVxuICAgICAgLnBvc3QoJy9kdy9vYXV0aDIvYWNjZXNzX3Rva2VuJylcbiAgICAgIC5yZXBseSh0b2tlbkNvZGUsIHtcbiAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlbixcbiAgICAgICAgZXhwaXJlc19pbjogMjMwMzIwOFxuICAgICAgfSk7XG59XG4iXX0=