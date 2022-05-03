import {renderHook} from "@testing-library/react-hooks"
import {useApi} from "./useApi";
import {HttpStatus} from "../common/httpStatus";
import {waitFor} from "@testing-library/react";
import {mockData} from "../../mocks/mockData";
import {load} from "./responseTemplates";
import {failedRequest} from "../../mocks/apiMocks";
import {rest} from "msw";
import {loadStrategyModule} from "../strategy/strategyApiModule";

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

const render = (timeToClearMs = 5000) => {
    return renderHook(() => useApi({isActive: true, timeToClearMs: timeToClearMs}))
}

const initialResponse = {status: "", message: "", body: "", isSuccess: false};

const getCurrent = (result) => {
    let [sendRequest, response, clearResponse, setSession] = result.current;
    return {sendRequest, response, clearResponse, setSession}
}

test("should return status in response", async () => {
    const {result} = render();

    await waitFor(() => {
        getCurrent(result).sendRequest(loadStrategyModule(mockData.exchange.account));
        expect(getCurrent(result).response.status).toBe(HttpStatus.ok);
    })
})

test("should return message on success response", async () => {
    const {result} = render();

    await waitFor(() => {
        getCurrent(result).sendRequest(loadStrategyModule(mockData.strategy.name));
        expect(getCurrent(result).response.message).toBe(load("Strategy").success)
    })
})

test("should return message on fail response", async () => {
    failedRequest(rest.get, "/user/strategy/:strategy", HttpStatus.badRequest);
    const {result} = render();

    await waitFor(() => {
        getCurrent(result).sendRequest(loadStrategyModule(mockData.strategy.name));
        expect(getCurrent(result).response.message).toBe(load("Strategy").fail);
    })
})

test("should clear response when called", async () => {
    const {result} = render();

    await waitFor(() => {
        getCurrent(result).sendRequest(loadStrategyModule(mockData.strategy.name));
        expect(getCurrent(result).response).not.toStrictEqual(initialResponse);

        getCurrent(result).clearResponse();
        expect(getCurrent(result).response).toStrictEqual(initialResponse);
    })

})

test("should clear response after 1 second", async () => {
    const {result, waitFor} = render(1000);

    await waitFor(() => {
            getCurrent(result).sendRequest(loadStrategyModule(mockData.strategy.name));
            expect(getCurrent(result).response).not.toStrictEqual(initialResponse);
        }, {timeout: 2000}
    );

    await waitFor(() => {
        expect(getCurrent(result).response).toStrictEqual(initialResponse)
    }, {timeout: 2000})

})