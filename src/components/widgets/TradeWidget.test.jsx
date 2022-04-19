import {render, screen, waitFor} from "@testing-library/react";
import {TradeWidget} from "./TradeWidget";
import {messages, mockData, wsClient} from "../../mocks/mockData";
import {WebSocketContext} from "../../App";

let expectedMessage;
const getExpectedMessage = (msg) => expectedMessage = msg;

beforeEach(() => {
    render(
        <WebSocketContext.Provider value={{wsMessages: messages(), wsClient: wsClient(getExpectedMessage)}}>
            <TradeWidget/>
        </WebSocketContext.Provider>
    );
})

test("should create trade elements on start", () => {
    expect(screen.getByText(mockData.trade.id)).toBeInTheDocument();
})

test("should send trade creation messages on active strategy update", async () => {
    await waitFor(() => expect(expectedMessage.endpoint)
        .toBe(`/app/${mockData.strategies.MockStrategy1.strategyName}/create-trade`))
})

test("should add trade elements on successful trade creation", () => {
    let expectedTradeId = "mockTradeId"
    expect(screen.getByText(expectedTradeId)).toBeInTheDocument();
})