import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {CryptoSelection} from "./CryptoSelection";
import userEvent from "@testing-library/user-event";
import {strategyIds} from "./strategyApiModule";
import {messages, wsClient} from "../../mocks/mockData";
import {WebSocketContext} from "../../App";

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

let expectedMessage;
const getExpectedMessage = (msg) => expectedMessage = msg;

describe("exchangeUtil interactions", () => {
    let baseInput, quoteInput, exchangeResponse;
    let updateAssets = (assets) => ({base: assets.base, quote: assets.quote});

    test("should display error when exchangeUtil has not been set", async () => {
        render(
            <WebSocketContext.Provider value={{wsMessages: messages(), wsClient: wsClient(getExpectedMessage)}}>
                <CryptoSelection exchangeUtil={""}
                                 updateAssets={updateAssets}
                                 loadedAssets={{base: "", quote: ""}}/>
            </WebSocketContext.Provider>
        );

        exchangeResponse = screen.getByTestId("exchangeStatus");
        baseInput = screen.getByRole("textbox", {name: "Base Symbol"});
        quoteInput = screen.getByRole("textbox", {name: "Quote Symbol"});

        userEvent.type(baseInput, "BTC");
        userEvent.type(quoteInput, "USD");

        await waitFor(() => expect(exchangeResponse).toHaveTextContent("Exchange is not valid."))
    })
})

describe("api interactions", () => {
    let baseInput, quoteInput, assetsResponse;
    let updateAssets = (assets) => ({base: assets.base, quote: assets.quote});

    const cleanRender = (messages) => {
        render(
            <WebSocketContext.Provider value={{wsMessages: messages, wsClient: wsClient(getExpectedMessage)}}>
                <CryptoSelection exchangeUtil="exchangeUtil"
                                 updateAssets={updateAssets}
                                 loadedAssets={{base: "", quote: ""}}/>
            </WebSocketContext.Provider>
        );

        baseInput = screen.getByRole("textbox", {name: "Base Symbol"});
        quoteInput = screen.getByRole("textbox", {name: "Quote Symbol"});
        assetsResponse = screen.getByTestId(strategyIds.getAssetPairData);
    };

    test("should display checkmark for valid asset pairs", async () => {
        cleanRender(messages())
        userEvent.type(baseInput, "BTC");
        userEvent.type(quoteInput, "USD");

        await waitFor(() => expect(assetsResponse).toHaveTextContent("✔"));
    });
    test("should display error for invalid asset pairs", async () => {
        let wsMessages = {...messages()};
        wsMessages["/topic/asset-pairs"] = {error: ["error"]};
        cleanRender(wsMessages);

        await waitFor(() => expect(assetsResponse).toHaveTextContent("is invalid."));
    });
});