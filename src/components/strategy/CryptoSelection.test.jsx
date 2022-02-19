import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {CryptoSelection} from "./CryptoSelection";
import userEvent from "@testing-library/user-event";
import {HttpStatus} from "../common/httpStatus";
import {rest} from "msw";
import {strategyIds} from "./strategyApiModule";
import {failedRequest} from "../../mocks/apiMocks";

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

describe("api interactions", () => {
    let baseInput, quoteInput, assetsResponse;
    let updateAssets = (assets) => ({base: assets.base, quote: assets.quote});

    beforeEach(() => {
        render(
            <CryptoSelection updateAssets={updateAssets} loadedAssets={{base: "", quote: ""}}/>
        );

        baseInput = screen.getByRole("textbox", {name: "Base Symbol"});
        quoteInput = screen.getByRole("textbox", {name: "Quote Symbol"});
        assetsResponse = screen.getByTestId(strategyIds.getAssetPairData);
    });
    test("should display checkmark for valid asset pairs", async () => {
        userEvent.type(baseInput, "BTC");
        userEvent.type(quoteInput, "USD");

        await waitFor(() => expect(assetsResponse).toHaveTextContent("✔"));
    });
    test("should display error for invalid asset pairs", async () => {
        failedRequest(rest.get, "/asset-pair/:assets/:brokerage", HttpStatus.notFound);
        userEvent.type(baseInput, "BTC");
        userEvent.type(quoteInput, "UD");

        await waitFor(() => expect(assetsResponse).toHaveTextContent("BTCUD is invalid."));
    });
});