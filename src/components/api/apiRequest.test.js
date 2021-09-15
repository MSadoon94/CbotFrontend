import {apiRequest} from "./apiRequest";
import {create, load, save, validation} from "./responseTemplates";
import {testServer} from "../../mocks/testServer";
import {rest} from "msw";
import {HttpCodes} from "../common/httpCodes";
import {apiConfig, apiHandler} from "./apiUtil";

const failedRequest = (restMethod, endpoint, statusCode = HttpCodes.badRequest) => {
    testServer.use(restMethod(`http://localhost/${endpoint}`,
        (req, res, context) => {
            return res(context.status(statusCode));
        }))
};

let mockData = {
    assetPair: {base: "BTC", quote: "USD"},
    saveStrategy: {strategy: {}},
    card: {account: "account", password: "password", balance: ""}
};
let mockAuth = {
    jwt: "mockJwt",
    expiration: new Date(Date.now() + 10000).toUTCString(),
    username: "username",
    isLoggedIn: true
};

afterEach(() => {
    mockAuth = {
        jwt: "mockJwt",
        expiration: new Date(Date.now() + 10000).toUTCString(),
        username: "username",
        isLoggedIn: true
    };
});

describe("common actions", () => {

    let commonConfig =
        apiConfig({url: "api/home/card", method: "post"}, mockData.card, mockAuth);

    let refreshFailConfig = apiConfig(
        {url: "api/home/card", method: "post"},
        mockData.card,
        {...mockAuth, expiration: new Date(Date.now() - 10000).toUTCString()});

    let commonHandler = apiHandler(
        create("account"), (res) => {
            mockAuth = res
        }
    );


    test("should return error message when internal server error is received", async () => {
        failedRequest(rest.post, "api/home/card", HttpCodes.internalServerError);

        await apiRequest(commonConfig, commonHandler);

        expect(commonHandler.output).toBe("Sorry, the server did not respond, please try again later.");
    });

    test("should cancel request when jwt is expired and refresh attempt has failed", async () => {
        failedRequest(rest.post, "api/refreshjwt", HttpCodes.unauthorized);

        await apiRequest(refreshFailConfig, commonHandler);

        expect(commonHandler.output).toBe("Session expired, logging out.");
    });

    test("should refresh request when jwt is expired but session is valid", async () => {
        await apiRequest(refreshFailConfig, commonHandler);

        expect(commonHandler.output.message).toBe(commonHandler.templates.success)
    });

    test("should refresh stored jwt when refreshed", async () => {
        await apiRequest(refreshFailConfig, commonHandler);

        expect(mockAuth.jwt).toEqual("refreshedJwt");
    });

    test("should refresh stored expiration when refreshed", async () => {
        await apiRequest(refreshFailConfig, commonHandler);

        expect(mockAuth.expiration).toEqual("newExpiration");
    });

    test("should log out user when refresh fails", async () => {
        failedRequest(rest.post, "api/refreshjwt", HttpCodes.unauthorized);
        await apiRequest(refreshFailConfig, commonHandler);

        expect(mockAuth.isLoggedIn).toBe(false);
    });

});

describe("specific api actions", () => {

    test.concurrent.each`
    api                              |method    |data                       |templates         
    ${"api/asset-pair/BTCUSD/kraken"}|${"get"}  |${mockData.assetPair}      |${validation("BTC:USD")}
    ${"api/save-strategy"}           |${"post"} |${mockData.saveStrategy}   |${save("Strategy")}
    ${"api/home/card"}               |${"post"} |${mockData.card}           |${create("account")}
    ${"api/home/card/account"}       |${"get"}  |${null}                    |${load("Card")}
    `("should send valid $api request and receive successful response",
        async ({api, method, data, templates}) => {
            let config = apiConfig({url: api, method: method}, data, mockAuth);
            let handler = apiHandler(templates, mockAuth);

            await apiRequest(config, handler);

            expect(handler.output.message).toBe(handler.templates.success);
        });

    test.concurrent.each`
    api                                 |method     |data                       |templates                     |failMethod
    ${"api/asset-pair/BTCUS/kraken"}    |${"get"}   |${mockData.assetPair}      |${validation("BTC:US")} |${rest.get}
    ${"api/save-strategy"}              |${"post"}  |${mockData.saveStrategy}   |${save("Strategy")}     |${rest.post}
    ${"api/home/card"}                  |${"post"}  |${mockData.card}           |${create("account")}    |${rest.post}
    ${"api/home/card/account"}          |${"get"}   |${null}                    |${load("Card")}         |${rest.get}
    `("should send invalid $api request and receive rejected response",
        async ({api, method, data, templates, failMethod}) => {
            failedRequest(failMethod, api);
            let config = apiConfig({url: api, method: method}, data, mockAuth);
            let handler = apiHandler(templates, mockAuth);

            await apiRequest(config, handler);

            expect(handler.output).toBe(handler.templates.fail);
        })

});
