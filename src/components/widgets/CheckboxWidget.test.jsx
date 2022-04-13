import {render, screen, waitFor} from "@testing-library/react";
import {CheckboxWidget} from "./CheckboxWidget";
import {messages, mockData, wsClient} from "../../mocks/mockData";
import userEvent from "@testing-library/user-event";
import {WebSocketContext} from "../../App";

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

const endpoint = "/app/strategies/names"
let mockStrategies = {...mockData.strategies};
let expectedMessage;
let getExpectedMessage = (msg) => expectedMessage = msg;

/* If the render function goes in the beforeEach section, the same document.body is used for each test and the previous
*   results will fail the next test. More details:
*   https://stackoverflow.com/questions/57098027/react-testing-library-cleanup-not-working-in-jests-describe-bocks */
const cleanRender = () => {
    render(
        <WebSocketContext.Provider value={{wsMessages: messages(), wsClient: wsClient(getExpectedMessage)}}>
            <CheckboxWidget type="strategies"
                            websocket={{
                                topic: ["/topic/strategies/names"],
                                sendTo: [endpoint]
                            }}
            />
        </WebSocketContext.Provider>
    )
}

test("should create strategy checkboxes on message received", async () => {
    cleanRender();
    await waitFor(() => expect(screen.getAllByRole("checkbox").length).toBe(2));
})

test("should send to specified endpoint on checkbox select", async () => {
    cleanRender();
    userEvent.click(screen.getByRole("checkbox", {name: mockStrategies.MockStrategy1.strategyName}));
    await waitFor(() => expect(expectedMessage.endpoint).toBe(endpoint));
})

test("should send message of checked option on checkbox select", async () => {
    cleanRender();
    userEvent.click(screen.getByRole("checkbox", {name: mockStrategies.MockStrategy1.strategyName}));
    await waitFor(() => expect(expectedMessage.message).toBe(mockStrategies.MockStrategy1.strategyName));
})