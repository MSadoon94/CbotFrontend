import {addCard, getCard} from "./CardApi";
import {testServer} from "../../mocks/testServer";
import {rest} from "msw";
import {getReqInterceptor, postReqInterceptor} from "../common_api/RequestInterceptors";

let outcome;

let card = {account: "account", password: "password", jwt: "jwtMock", expiration: Date.now() + 100000};


const apiRequest = async (apiCall, interceptor, model) => {
    await apiCall((model), interceptor, (res) => outcome = JSON.parse(res))
};

const failedPostRequest = (endpoint) => {
    testServer.use(rest.post(`http://localhost/${endpoint}`,
        (req, res, context) => {
            return res(context.status(400));
        }))
};

const failedGetRequest = (endpoint) => {
    testServer.use(rest.get(`http://localhost/${endpoint}`,
        (req, res, context) => {
            const {card} = req.params;
            return res(context.status(400));
        }))
};

describe("add card api", () => {
    test("should return card created message for successful card additions", async () => {
        await apiRequest(addCard, postReqInterceptor, card);

        expect(outcome.message).toBe(`${card.account} was created successfully.`);
    });

    test("should return error message for failed card additions", async () => {
        failedPostRequest("home/card");

        await apiRequest(addCard, postReqInterceptor, card);

        expect(outcome.message).toBe(`Error: ${card.account} could not be created.`);
    });

});
describe("get card", () => {
    test("should return card when request is successful", async () => {
        await apiRequest(getCard, getReqInterceptor, card);

        card = {account: card.account, password: card.password};

        expect(outcome.message).toStrictEqual(card);
    });

    test("should return error message for failed card requests", async () => {
        failedGetRequest("/home/card/:account");

        card = {account: "accoun", password: card.password};

        await apiRequest(getCard, getReqInterceptor, card);

        expect(outcome.message).toBe(`Error: ${card.account} could not be retrieved`);
    })
});
