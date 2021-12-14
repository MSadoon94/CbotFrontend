import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {CryptoSelection} from "./CryptoSelection";
import userEvent from "@testing-library/user-event";
import {HttpStatus} from "../common/httpStatus";
import {testServer} from "../../mocks/testServer";
import {rest} from "msw";
import {mockId} from "../../mocks/mockData";
import {ApiManager} from "../api/ApiManager";

const failedRequest = (restMethod, endpoint, statusCode = HttpStatus.badRequest) => {
    testServer.use(restMethod(`http://localhost/api/${endpoint}`,
        (req, res, context) => {
            return res(context.status(statusCode), context.json({error: "error information"}));
        }))
};

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

describe("api interactions", () => {
    let baseInput, quoteInput, assetsResponse;

    beforeEach(() => {
        render(
            <ApiManager userId={mockId}>
            <CryptoSelection loadedAssets={{base: "", quote: ""}}/>
            </ApiManager>
                );

        baseInput = screen.getByRole("textbox", {name: "Base Symbol"});
        quoteInput = screen.getByRole("textbox", {name: "Quote Symbol"});
        assetsResponse = screen.getByTestId("selectCrypto");
    });
    test("should display checkmark for valid asset pairs", async () => {
        userEvent.type(baseInput, "BTC");
        userEvent.type(quoteInput, "USD");

        await waitFor(() => expect(assetsResponse).toHaveTextContent("✔"));
    });
    test("should display error for invalid asset pairs", async () => {
        failedRequest(rest.get, "asset-pair/:assets/:brokerage", HttpStatus.notFound);
        userEvent.type(baseInput, "BTC");
        userEvent.type(quoteInput, "UD");

        await waitFor(() => expect(assetsResponse).toHaveTextContent("BTCUD is invalid."));
    });

});