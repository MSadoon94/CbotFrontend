import {render, screen} from "@testing-library/react";
import {WebSocketContext} from "../../App";
import {messages, mockData, wsClient} from "../../mocks/mockData";
import {TradeMetrics} from "./TradeMetrics";

let expectedMessage;
const getExpectedMessage = (msg) => expectedMessage = msg;

let candlestickChart;

//Need this for apex charts to work while testing with jest.
jest.mock('react-apexcharts', () => {
    return {
        __esModule: true,
        default: () => {
            return <div />
        },
    }
})
beforeEach(() => {
    render(
        <WebSocketContext.Provider value={{wsMessages: messages(), wsClient: wsClient(getExpectedMessage)}}>
            <TradeMetrics trade={mockData.trade}/>
        </WebSocketContext.Provider>
    )
    candlestickChart = screen.getByRole("figure");
})
test("should display candlestick chart for trade", () => {
    expect(candlestickChart).toBeVisible();
})