import {apiRequest, refresh} from "./apiRequest";
import {changeState, create, load, save, validation} from "./responseTemplates";
import {rest} from "msw";
import {HttpStatus} from "../common/httpStatus";
import {apiConfig, publicConfig} from "./apiUtil";
import {mockData, mockId} from "../../mocks/mockData";
import {waitFor} from "@testing-library/react";
import {failedRequest} from "../../mocks/apiMocks";

let templates = create("Account");
let commonConfig = {...apiConfig({url: "/user/card", method: "post"}, mockData.card), id: mockId};

describe("common error behavior", () => {

    test("should return error message when internal server error is received", async () => {
        failedRequest(rest.post, "/refresh-jwt", HttpStatus.internalServerError);
        failedRequest(rest.post, "/user/card", HttpStatus.internalServerError);

        let apiResponse;
        await waitFor(() => apiRequest(commonConfig, templates).then((res) => apiResponse = res));

        await waitFor(() => {
            expect(apiResponse.message).toBe("Sorry, the server did not respond, please try again later.");
        });

    });

    test("should return response message for http conflict status rejections", async () => {
        failedRequest(
            rest.post,
            "/sign-up",
            HttpStatus.conflict,
            "A user already exists with the username 'User', please choose another username."
        )
        let config = {...publicConfig({url: "/sign-up", method: "post"}, mockData.user)};

        let apiResponse;
        await waitFor(() =>
            apiRequest(config, create("User")).then((res) => apiResponse = res)
        );

        await waitFor(() => {
            expect(apiResponse.message).toBe("A user already exists with the username 'User', please choose another username.");
        });
    })

});

describe("refresh behavior", () => {

    let refreshFailConfig = {
        ...commonConfig,
        id: {...mockId, expiration: new Date(Date.now() - 10000).toUTCString()},
    };

    test("should cancel request when jwt is expired and refresh attempt has failed", async () => {
        failedRequest(rest.post, "/refresh-jwt", HttpStatus.unauthorized);
        failedRequest(rest.post, "/user/card", HttpStatus.unauthorized);

        let apiResponse;
        await waitFor(() =>
            apiRequest(refreshFailConfig, templates).then((res) => apiResponse = res)
        );

        await expect(apiResponse.message).toBe("Session expired, logging out.");
    });

    test("should refresh request when jwt is expired but session is valid", async () => {
        await apiRequest(refreshFailConfig, templates)
            .then((res) => expect(res.message).toBe(templates.success));
    });

});

describe("local storage behavior", () => {

    test("should set session as expired when refresh fails", async () => {
        failedRequest(rest.post, "/refresh-jwt", HttpStatus.unauthorized);

        await refresh(() => null).catch(() => null);

        expect(JSON.parse(localStorage.getItem("session")).isExpired).toBe(true);
    });

    test("should set session as not expired when refresh succeeds", async () => {
        await refresh(() => null);

        expect(JSON.parse(localStorage.getItem("session")).isExpired).toBe(false);
    });
    test("should set logged in as true when refresh succeeds", async () => {
        await refresh(() => null);

        expect(JSON.parse(localStorage.getItem("session")).isLoggedIn).toBe(true);
    });
    test("should set logged in as false when refresh succeeds", async () => {
        failedRequest(rest.post, "/refresh-jwt", HttpStatus.unauthorized);

        await refresh(() => null).catch(() => null);

        expect(JSON.parse(localStorage.getItem("session")).isLoggedIn).toBe(false);
    });

})

describe("public endpoint behavior", () => {

    test.concurrent.each`
    api                              |method    |data                       |templates         
    ${"/login"}                   |${"post"} |${mockData.user}           |${load("User")}
    ${"/sign-up"}                 |${"post"} |${mockData.user}           |${save("User")}
    `("should send valid $api request and receive successful response",
        async ({api, method, data, templates}) => {
            let config = publicConfig({url: api, method}, data);

            await apiRequest(config, templates)
                .then((res) => expect(res.message).toBe(templates.success));
        });

    test.concurrent.each`
   api             |method    |data             |templates              |failMethod
   ${"/login"}  |${"post"} |${mockData.user} |${load("User")}  |${rest.post}
   ${"/sign-up"}|${"post"} |${mockData.user} |${create("User")}  |${rest.post}
   `("should send invalid $api request and receive rejected response",
        async ({api, method, data, templates, failMethod}) => {

            failedRequest(failMethod, api);
            let config = publicConfig({url: api, method}, data);

            await apiRequest(config, templates)
                .then((res) => expect(res.message).toBe(templates.fail));
        });

});

describe("specific api actions", () => {

    test.concurrent.each`
    api                              |method     |data                       |templates         
    ${"/asset-pair/BTC/USD/kraken"}  |${"get"}   |${null}                    |${validation("BTC:USD")}
    ${"/user/strategy"}              |${"post"}  |${mockData.saveStrategy}   |${save("Strategy")}
    ${"/log-out"}                    |${"delete"}|${null}                    |${changeState("Logout")}
    `("should send valid $api request and receive successful response",
        async ({api, method, data, templates}) => {

            let config = {...apiConfig({url: api, method}, data)};

            await apiRequest(config, templates)
                .then((res) => expect(res.message).toBe(templates.success));
        });

    test.concurrent.each`
    api                                 |method     |data                       |templates                     |failMethod
    ${"/asset-pair/BTCUS/kraken"}    |${"get"}   |${mockData.assetPair}      |${validation("BTC:US")} |${rest.get}
    ${"/user/strategy"}              |${"post"}  |${mockData.saveStrategy}   |${save("Strategy")}     |${rest.post}
    ${"/login"}                      |${"post"}  |${mockData.user}           |${load("User")}         |${rest.post}
    ${"/log-out"}                    |${"delete"}|${null}                    |${changeState("Logout")}|${rest.delete}
    `("should send invalid $api request and receive rejected response",
        async ({api, method, data, templates, failMethod}) => {

            failedRequest(failMethod, api);
            let config = {...apiConfig({url: api, method}, data)};

            await apiRequest(config, templates)
                .then((res) => expect(res.message).toBe(templates.fail));
        });
});
