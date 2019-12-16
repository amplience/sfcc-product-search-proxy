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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXRva2VuLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnZXQtdG9rZW4uc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUF3QjtBQUN4Qiw4Q0FBdUI7QUFFdkIsOEVBQXFEO0FBQ3JELHdEQUFvRDtBQUVwRCxhQUFJLENBQUMsbUNBQW1DLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQ2xELE1BQU0sR0FBRyxHQUFZO1FBQ25CLE9BQU8sRUFBRTtZQUNQLFdBQVcsRUFBRSxNQUFNO1lBQ25CLGVBQWUsRUFBRSxVQUFVO1lBQzNCLFFBQVEsRUFBRSxlQUFlO1NBQzFCO0tBQ0YsQ0FBQztJQUVGLE1BQU0sU0FBUyxHQUFHLDJCQUEyQixDQUFDO0lBQzlDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUVqQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGdDQUFjLEVBQUUsQ0FBQztJQUVqQyxNQUFNLE1BQU0sR0FBRyxNQUFNLG1CQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRXhDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0FBQ3pCLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLDhDQUE4QyxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtJQUM3RCxNQUFNLEdBQUcsR0FBWTtRQUNuQixPQUFPLEVBQUU7WUFDUCxXQUFXLEVBQUUsTUFBTTtZQUNuQixlQUFlLEVBQUUsVUFBVTtZQUMzQixRQUFRLEVBQUUsZUFBZTtTQUMxQjtLQUNGLENBQUM7SUFFRixNQUFNLFNBQVMsR0FBRywyQkFBMkIsQ0FBQztJQUM5QyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxnQ0FBYyxFQUFFLENBQUM7SUFDakMsSUFBSSxNQUFNLENBQUM7SUFDWCxJQUFJO1FBQ0YsTUFBTSxHQUFHLE1BQU0sbUJBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDbkM7SUFBQyxPQUFPLENBQUMsRUFBRTtLQUVYO0lBQ0QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDeEIsQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMsK0NBQStDLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQzlELE1BQU0sR0FBRyxHQUFZO1FBQ25CLE9BQU8sRUFBRTtZQUNQLFdBQVcsRUFBRSxNQUFNO1lBQ25CLGVBQWUsRUFBRSxVQUFVO1lBQzNCLFFBQVEsRUFBRSxlQUFlO1NBQzFCO0tBQ0YsQ0FBQztJQUVGLE1BQU0sU0FBUyxHQUFHLDJCQUEyQixDQUFDO0lBQzlDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUVqQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGdDQUFjLEVBQUUsQ0FBQztJQUNqQyxJQUFJLE1BQU0sQ0FBQztJQUNYLElBQUk7UUFDRixNQUFNLEdBQUcsTUFBTSxtQkFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNuQztJQUFDLE9BQU8sQ0FBQyxFQUFFO0tBRVg7SUFDRCxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN4QixDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsZ0JBQWdCLENBQ3JCLEtBQWEsRUFDYixZQUFvQixHQUFHO0lBQ3pCLGNBQUksQ0FBQyxnQ0FBZ0MsQ0FBQztTQUNqQyxJQUFJLENBQUMseUJBQXlCLENBQUM7U0FDL0IsS0FBSyxDQUFDLFNBQVMsRUFBRTtRQUNoQixZQUFZLEVBQUUsS0FBSztRQUNuQixVQUFVLEVBQUUsT0FBTztLQUNwQixDQUFDLENBQUM7QUFDVCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5vY2sgZnJvbSAnbm9jayc7XG5pbXBvcnQgdGVzdCBmcm9tICdhdmEnO1xuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gJy4uLy4uL3NyYy9tb2RlbC9yZXF1ZXN0JztcbmltcG9ydCBnZXRUb2tlbiBmcm9tICcuLi8uLi9zcmMvZW5kcG9pbnRzL2dldC10b2tlbic7XG5pbXBvcnQgeyBTaW1wbGVSZXNwb25zZSB9IGZyb20gJy4uL3NpbXBsZS1yZXNwb25zZSc7XG5cbnRlc3QoJ3Nob3VsZCBzdWNjZWVkIHdoZW4gdmFsaWQgcmVxdWVzdCcsIGFzeW5jIHQgPT4ge1xuICBjb25zdCByZXE6IFJlcXVlc3QgPSB7XG4gICAgaGVhZGVyczoge1xuICAgICAgJ3gtYXV0aC1pZCc6ICdteUlkJyxcbiAgICAgICd4LWF1dGgtc2VjcmV0JzogJ215U2VjcmV0JyxcbiAgICAgIGVuZHBvaW50OiAnaHR0cDovL3NpbXBsZSdcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYXV0aFRva2VuID0gJ3NpMzI0dTIyM25qbnBpcHVoMnB1M240aWYnO1xuICBzZXRVcE1vY2tTZXJ2ZXJzKGF1dGhUb2tlbiwgMjAwKTtcblxuICBjb25zdCByZXMgPSBuZXcgU2ltcGxlUmVzcG9uc2UoKTtcblxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBnZXRUb2tlbihyZXEsIHJlcyk7XG5cbiAgdC5pcyhyZXN1bHQsIGF1dGhUb2tlbilcbn0pO1xuXG50ZXN0KCdzaG91bGQgcmV0dXJuIDUwMCBhbmQgdGhyb3cgd2hlbiBiYWQgcmVxdWVzdCcsIGFzeW5jIHQgPT4ge1xuICBjb25zdCByZXE6IFJlcXVlc3QgPSB7XG4gICAgaGVhZGVyczoge1xuICAgICAgJ3gtYXV0aC1pZCc6ICdteUlkJyxcbiAgICAgICd4LWF1dGgtc2VjcmV0JzogJ215U2VjcmV0JyxcbiAgICAgIGVuZHBvaW50OiAnaHR0cDovL3NpbXBsZSdcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYXV0aFRva2VuID0gJ3NpMzI0dTIyM25qbnBpcHVoMnB1M240aWYnO1xuICBzZXRVcE1vY2tTZXJ2ZXJzKGF1dGhUb2tlbiwgNDAwKTtcblxuICBjb25zdCByZXMgPSBuZXcgU2ltcGxlUmVzcG9uc2UoKTtcbiAgbGV0IHJlc3VsdDtcbiAgdHJ5IHtcbiAgICByZXN1bHQgPSBhd2FpdCBnZXRUb2tlbihyZXEsIHJlcyk7XG4gIH0gY2F0Y2ggKGUpIHtcblxuICB9XG4gIHQuaXMocmVzLmNvZGUsIDUwMCk7XG4gIHQuaXMocmVzLmJvZHkuY29kZSwgJ1RPS0VOX0VSUk9SJyk7XG4gIHQuaXMoKCFyZXN1bHQpLCB0cnVlKTtcbn0pO1xuXG50ZXN0KCdzaG91bGQgcmV0dXJuIDUwMCBhbmQgdGhyb3cgd2hlbiBzZXJ2ZXIgZXJyb3InLCBhc3luYyB0ID0+IHtcbiAgY29uc3QgcmVxOiBSZXF1ZXN0ID0ge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgICd4LWF1dGgtaWQnOiAnbXlJZCcsXG4gICAgICAneC1hdXRoLXNlY3JldCc6ICdteVNlY3JldCcsXG4gICAgICBlbmRwb2ludDogJ2h0dHA6Ly9zaW1wbGUnXG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGF1dGhUb2tlbiA9ICdzaTMyNHUyMjNuam5waXB1aDJwdTNuNGlmJztcbiAgc2V0VXBNb2NrU2VydmVycyhhdXRoVG9rZW4sIDUwNCk7XG5cbiAgY29uc3QgcmVzID0gbmV3IFNpbXBsZVJlc3BvbnNlKCk7XG4gIGxldCByZXN1bHQ7XG4gIHRyeSB7XG4gICAgcmVzdWx0ID0gYXdhaXQgZ2V0VG9rZW4ocmVxLCByZXMpO1xuICB9IGNhdGNoIChlKSB7XG5cbiAgfVxuICB0LmlzKHJlcy5jb2RlLCA1MDApO1xuICB0LmlzKHJlcy5ib2R5LmNvZGUsICdUT0tFTl9FUlJPUicpO1xuICB0LmlzKCghcmVzdWx0KSwgdHJ1ZSk7XG59KTtcblxuZnVuY3Rpb24gc2V0VXBNb2NrU2VydmVycyhcbiAgICB0b2tlbjogc3RyaW5nLFxuICAgIHRva2VuQ29kZTogbnVtYmVyID0gMjAwKSB7XG4gIG5vY2soJ2h0dHBzOi8vYWNjb3VudC5kZW1hbmR3YXJlLmNvbScpXG4gICAgICAucG9zdCgnL2R3L29hdXRoMi9hY2Nlc3NfdG9rZW4nKVxuICAgICAgLnJlcGx5KHRva2VuQ29kZSwge1xuICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuLFxuICAgICAgICBleHBpcmVzX2luOiAyMzAzMjA4XG4gICAgICB9KTtcbn1cbiJdfQ==