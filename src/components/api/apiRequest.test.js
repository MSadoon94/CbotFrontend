import {apiRequest, headers} from "./apiRequest";
import {create, validation} from "./responseTemplates";
import {testServer} from "../../mocks/testServer";
import {rest} from "msw";
import {HttpCodes} from "../common/httpCodes";

let card = {
    account: "account",
    password: "password",
    jwt: "jwtMock",
    expiration: new Date(Date.now() + 10000).toUTCString()
};

const failedRequest = (restMethod, endpoint, statusCode = HttpCodes.badRequest) => {
    testServer.use(restMethod(`http://localhost/api/${endpoint}`,
        (req, res, context) => {
            return res(context.status(statusCode));
        }))
};

let config = {
    url: "/api/home/card",
    method: "post",
    headers: headers("mockJwt"),
    data: card,
    username: card.username,
    jwt: card.jwt,
    expiration: card.expiration
};

let handler = {
    output: null,
    templates: create(card.account),
    onSuccess: (res) => {
        handler.output = res
    },
    onFail: (res) => {
        handler.output = res
    }
};

test("should return success message when request is accepted", async () => {
    await apiRequest(config, handler);

    expect(handler.output).toBe(handler.templates.success);
});

test("should return error message when internal server error is received", async () => {
    failedRequest(rest.post, "home/card", HttpCodes.internalServerError);

    await apiRequest(config, handler);

    expect(handler.output).toBe("Sorry, the server did not respond, please try again later.");
});

test("should cancel request when jwt is expired and refresh attempt has failed", async () => {
    failedRequest(rest.post, "refreshjwt", HttpCodes.unauthorized);
    config.expiration = new Date(Date.now() - 10000).toUTCString();

    await apiRequest(config, handler);

    expect(handler.output).toBe("Session expired, logging out.");
});

test("should refresh request when jwt is expired but session is valid", async () => {
    config.expiration = new Date(Date.now() - 10000).toUTCString();

    await apiRequest(config, handler);

    expect(handler.output).toBe(handler.templates.success)
});

describe("api test array", () => {
    let data = {
        assetPair: {base: "BTC", quote: "USD"}
    };

    let axiosConfig = (api, method, data) => {
        return {
            url: `/api/${api}`,
            method: method,
            headers: headers("mockJwt"),
            data: data,
            username: card.username,
            jwt: "mockJwt",
            expiration: new Date(Date.now() + 10000).toUTCString()
        };
    };

    let resHandler = (templates) => {
        let handler = {
            output: null,
            templates: templates,
            onSuccess: (res) => {
                handler.output = res
            },
            onFail: (res) => {
                handler.output = res
            }
        };
        return handler;
    };

    test.concurrent.each`
    api            |method     |data             |templates         
    ${"asset-pair/BTCUSD/kraken"}|${"get"}  |${data.assetPair}|${validation("BTC:USD")}
    `("should send valid $api request and receive successful response",
        async ({api, method, data, templates}) => {
            let handler = resHandler(templates);
            let config = axiosConfig(api, method, data);

            await apiRequest(config, handler);

            expect(handler.output).toBe(handler.templates.success);
        });


    test.concurrent.each`
    api                         |method     |data             |templates                     |failMethod
    ${"asset-pair/BTCUS/kraken"}|${"get"}   |${data.assetPair}|${validation("BTC:US")} |${rest.get}
    `("should send invalid $api request and receive rejected response",
        async ({api, method, data, templates, failMethod}) => {
            failedRequest(failMethod, api);
            let handler = resHandler(templates);
            let config = axiosConfig(api, method, data);

            await apiRequest(config, handler);

            expect(handler.output).toBe(handler.templates.fail);
        })

});
