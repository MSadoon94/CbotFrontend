import {addCard} from "./CardApi";
import {testServer} from "../../mocks/testServer";
import {rest} from "msw";

let outcome;

const card = {account: "account", password: "password"};
const jwt = "jwt";

const apiRequest = async (apiCall, model) => {
    await apiCall((model), jwt, (res) => outcome = JSON.parse(res))
};

const failedPostRequest = (endpoint) => {
    testServer.use(rest.post(`http://localhost/${endpoint}`,
        (req, res, context) => {
            return res(context.status(400));
        }))
};

describe("add card api", () =>{
    test("should return card created message for successful card additions", async () => {
        await apiRequest(addCard, card);

        expect(outcome.message).toBe(`${card.account} was created successfully.`);
    });

    test("should return error message for failed card additions", async () => {
        failedPostRequest("home/card");

        await apiRequest(addCard, card);

        expect(outcome.message).toBe(`Error: ${card.account} could not be created.`);
    });

});
