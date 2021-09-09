import {postReqInterceptor} from "./requestInterceptors";

let card = {
    account: "account",
    password: "password",
    jwt: "jwtMock",
    expiration: "2021-07-12T16:46:54.000+00:00"
};
let request = {data: {...card}};

describe("post request interceptor", () => {

    test("should add cancel message to requests with expired jwt", () => {
        request = postReqInterceptor(request);

        expect(request.cancelToken.reason.message).toBe("Jwt expired");
    })

});