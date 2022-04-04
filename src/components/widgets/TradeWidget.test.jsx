import {render, screen} from "@testing-library/react";
import {TradeWidget} from "./TradeWidget";
import userEvent from "@testing-library/user-event";
import {mockData} from "../../mocks/mockData";

let messageButton;

jest.mock("react-stomp", () => ({
    __esModule: true,
    default: (props) => {
        return <button id="mockReceiveMessage"
                onClick={() => {
                    props.onMessage(mockData.trade)
                }}>
            MockReceiveMessage
        </button>
    }
}))

beforeEach(() => {
    render(
        <TradeWidget/>
    );
    messageButton = screen.getByRole("button", {name: "MockReceiveMessage"});
})

test("should create trade element on message received",  () => {
    userEvent.click(messageButton);

    expect(screen.getByText(mockData.trade.id)).toBeInTheDocument();
})