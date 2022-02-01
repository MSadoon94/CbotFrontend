import {apiRequest} from "./apiRequest";
import {changeState, create, load, save, validation} from "./responseTemplates";
import {testServer} from "../../mocks/testServer";
import {rest} from "msw";
import {HttpStatus} from "../common/httpStatus";
import {apiConfig, apiHandler, publicConfig} from "./apiUtil";
import {mockData} from "../../mocks/mockData";
import {mockId} from "../../mocks/mockData";


let refreshed, commonHandler;
let commonConfig = {...apiConfig({url: "api/user/card", method: "post"}, mockData.card), id: mockId};

const failedRequest = (restMethod, endpoint, statusCode = HttpStatus.badRequest, message) => {
    testServer.use(restMethod(`http://localhost/${endpoint}`,
        (req, res, context) => {
            return res(context.status(statusCode), context.json({message}));
        }))
};

const outcome = (handler) => {
    return handler.output.message;
};

beforeEach(() => {
    commonHandler = apiHandler(create("account"));
    commonHandler.onRefresh = {
        success: (refresh) => refreshed = refresh,
        fail: (refresh) => refreshed = refresh
    }
});

afterEach(() => {
    refreshed = undefined;
});

describe("common error behavior", () => {

    test("should return error message when internal server error is received", async () => {
        failedRequest(rest.post, "api/user/card", HttpStatus.internalServerError);

        await apiRequest(commonConfig, commonHandler);

        expect(outcome(commonHandler)).toBe("Sorry, the server did not respond, please try again later.");
    });

    test("should return response message for http conflict status rejections", async () => {
        failedRequest(
            rest.post,
            "api/sign-up",
            HttpStatus.conflict,
            "A user already exists with the username 'User', please choose another username."
        )

        let config = {...publicConfig({url: "api/sign-up", method: "post"}, mockData.user)};
        let handler = apiHandler(create("user"));

        await apiRequest(config, handler);

        expect(outcome(handler)).toBe("A user already exists with the username 'User', please choose another username.");
    })

});

describe("refresh behavior", () => {

    let refreshFailConfig = {
        ...commonConfig,
        id: {...mockId, expiration: new Date(Date.now() - 10000).toUTCString()},
    };

    test("should cancel request when jwt is expired and refresh attempt has failed", async () => {
        failedRequest(rest.post, "api/refresh-jwt", HttpStatus.unauthorized);

        await apiRequest(refreshFailConfig, commonHandler);

        expect(outcome(commonHandler)).toBe("Session expired, logging out.");
    });

    test("should refresh request when jwt is expired but session is valid", async () => {
        await apiRequest(refreshFailConfig, commonHandler);

        expect(outcome(commonHandler)).toBe(commonHandler.templates.success)
    });

    test("should refresh stored expiration when refreshed", async () => {
        await apiRequest(refreshFailConfig, commonHandler);

        expect(refreshed.expiration).toEqual("newExpiration");
    });

    test("should log out user when refresh fails", async () => {
        failedRequest(rest.post, "api/refresh-jwt", HttpStatus.unauthorized);
        await apiRequest(refreshFailConfig, commonHandler);

        expect(refreshed.isLoggedIn).toBe(false);
    });

});

describe("public endpoint behavior", () => {

    test.concurrent.each`
    api                              |method    |data                       |templates         
    ${"api/login"}                   |${"post"} |${mockData.user}           |${load("User")}
    ${"api/sign-up"}                  |${"post"} |${mockData.user}           |${save("User")}
    `("should send valid $api request and receive successful response",
        async ({api, method, data, templates}) => {
            let config = publicConfig({url: api, method}, data);
            let handler = apiHandler(templates);

            await apiRequest(config, handler);

            expect(outcome(handler)).toBe(templates.success);
        });

    test.concurrent.each`
   api             |method    |data             |templates              |failMethod
   ${"api/login"}  |${"post"} |${mockData.user} |${load("User")}  |${rest.post}
   ${"api/sign-up"} |${"post"} |${mockData.user} |${create("User")}  |${rest.post}
   `("should send invalid $api request and receive rejected response",
        async ({api, method, data, templates, failMethod}) => {

            failedRequest(failMethod, api);
            let config = publicConfig({url: api, method}, data);
            let handler = apiHandler(templates);

            await apiRequest(config, handler);

            expect(outcome(handler)).toBe(templates.fail);
        });

});

describe("specific api actions", () => {

    test.concurrent.each`
    api                              |method     |data                       |templates         
    ${"api/asset-pair/BTCUSD/kraken"}|${"get"}   |${null}                    |${validation("BTC:USD")}
    ${"api/user/strategy"}           |${"post"}  |${mockData.saveStrategy}   |${save("Strategy")}
    ${"api/log-out"}                  |${"delete"}|${null}                    |${changeState("Logout")}
    `("should send valid $api request and receive successful response",
        async ({api, method, data, templates}) => {

            let config = {
                ...apiConfig({url: api, method}, data),
                id: mockId, onRefresh: (refresh) => {
                    refreshed = refresh
                }
            };

            let handler = apiHandler(templates);

            await apiRequest(config, handler);

            expect(outcome(handler)).toBe(templates.success);
        });

    test.concurrent.each`
    api                                 |method     |data                       |templates                     |failMethod
    ${"api/asset-pair/BTCUS/kraken"}    |${"get"}   |${mockData.assetPair}      |${validation("BTC:US")} |${rest.get}
    ${"api/user/strategy"}              |${"post"}  |${mockData.saveStrategy}   |${save("Strategy")}     |${rest.post}
    ${"api/login"}                      |${"post"}  |${mockData.user}           |${load("User")}         |${rest.post}
    ${"api/log-out"}                     |${"delete"}|${null}                    |${changeState("Logout")}     |${rest.delete}
    `("should send invalid $api request and receive rejected response",
        async ({api, method, data, templates, failMethod}) => {

            failedRequest(failMethod, api);
            let config = {
                ...apiConfig({url: api, method}, data),
                id: mockId, onRefresh: (refresh) => {
                    refreshed = refresh
                }
            };

            let handler = apiHandler(templates);

            await apiRequest(config, handler);

            expect(outcome(handler)).toBe(templates.fail);
        })

});
