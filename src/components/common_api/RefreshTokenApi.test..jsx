import {refreshJwt} from "./RefreshTokenApi";
import {refreshTokenInterceptor} from "./RequestInterceptors";
import {testServer} from "../../mocks/testServer";
import {rest} from "msw";

let outcome;

let user = {
    username: "username",
    password: "password",
    authority: "USER",
    jwt: "jwt",
    expiration: Date.now() + 10000,
    outcome: ""
};


const apiRequest = async (apiCall, interceptor, model) => {
    await apiCall((model), interceptor, (res) => outcome = JSON.parse(res))
};

const failedPostRequest = (endpoint) => {
    testServer.use(rest.post(`http://localhost/${endpoint}`,
        (req, res, context) => {
            return res(context.status(400));
        }))
};

describe("token refresh api", () => {

    test("should return new jwt token if refresh token is valid", async () => {
        await apiRequest(refreshJwt, refreshTokenInterceptor, user);

        expect(outcome.body).toStrictEqual({jwt: "refreshedJwt", expiration: "newExpiration"})
    });

    test("should return message for successful token refreshes", async () => {
        await apiRequest(refreshJwt, refreshTokenInterceptor, user);

        expect(outcome.message).toBe("Successfully refreshed jwt token.");
    });

    test("should return message if refresh token has expired", async () => {
        failedPostRequest("refreshjwt");

        await apiRequest(refreshJwt, refreshTokenInterceptor, user);

        expect(outcome.message).toBe("Refresh token has expired, logging out.");
    });

});