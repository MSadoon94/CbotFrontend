import {renderHook} from "@testing-library/react-hooks"
import {loadCard} from "../card/cardApiModule";
import {useApi} from "./useApi";
import {HttpStatus} from "../common/httpStatus";
import {waitFor} from "@testing-library/react";
import {ApiManager} from "./ApiManager";
import {initialId} from "../../App";
import {mockData} from "../../mocks/mockData";
import {load} from "./responseTemplates";
import {failedRequest} from "../../mocks/apiMocks";
import {rest} from "msw";

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

const render = (onComplete, timeToClearMs = 5000) => {
    const wrapper = ({children}) => <ApiManager userId={initialId}>{children}</ApiManager>
    return renderHook(() => useApi(timeToClearMs), {wrapper})
}

const initialResponse = {status: "", message: "", body: "", isSuccess: false};
let successResponse, failResponse;

let onComplete = {
    success: (res) => successResponse = res,
    fail: (res) => failResponse = res
}

const getCurrent = (result) => {
    let [sendRequest, clearResponse, response] = result.current;
    return {sendRequest, clearResponse, response}
}

test("should return status in response", async () => {
    const {result} = render();

    await waitFor(() => {
        getCurrent(result).sendRequest(loadCard(mockData.card.account, onComplete, null));
        expect(getCurrent(result).response.status).toBe(HttpStatus.ok);
    })
})

test("should return message on success response", async () => {
    const {result} = render();

    await waitFor(() => {
       getCurrent(result).sendRequest(loadCard(mockData.card.account, onComplete, null));
        expect(getCurrent(result).response.message).toBe(load("Card").success)
    })
})

test("should return message on success response", async () => {
    failedRequest(rest.get, "api/user/card/:cardName", HttpStatus.badRequest);
    const {result} = render();

    await waitFor(() => {
        getCurrent(result).sendRequest(loadCard(mockData.card.account, onComplete, null));
        expect(getCurrent(result).response.message).toBe(load("Card").fail)
    })
})

test("should do success actions on complete", async () => {
    const {result} = render(onComplete);

    await waitFor(() => {
        getCurrent(result).sendRequest(loadCard(mockData.card.account, onComplete, null));
        expect(successResponse).toStrictEqual(getCurrent(result).response)
    })
})

test("should do fail actions on complete", async () => {
    failedRequest(rest.get, "api/user/card/:cardName", HttpStatus.badRequest);

    const {result} = render(onComplete);

    await waitFor(() => {
        getCurrent(result).sendRequest(loadCard(mockData.card.account, onComplete, null));
        expect(failResponse).toStrictEqual(getCurrent(result).response)
    })
})

test("should clear response when called", async () => {
    const {result} = render(onComplete);

    await waitFor(() => {
        getCurrent(result).sendRequest(loadCard(mockData.card.account, onComplete, null));
        expect(getCurrent(result).response).not.toStrictEqual(initialResponse);

        getCurrent(result).clearResponse();
        expect(getCurrent(result).response).toStrictEqual(initialResponse);
    })

})

test("should clear response after 1 second", async () => {
    const {result, waitFor} = render(onComplete, 1000);

    await waitFor(() => {
        getCurrent(result).sendRequest(loadCard(mockData.card.account, onComplete, null));
            expect(getCurrent(result).response).not.toStrictEqual(initialResponse);
        }, {timeout: 2000}
    );

    await waitFor(() => {
        expect(getCurrent(result).response).toStrictEqual(initialResponse)
    }, {timeout: 2000})

})