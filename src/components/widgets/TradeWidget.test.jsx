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
    expect(screen.getByText(mockData.trade.strategyName)).toBeInTheDocument();
})