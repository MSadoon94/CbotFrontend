import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {CryptoSelection} from "./CryptoSelection";
import userEvent from "@testing-library/user-event";
import {HttpCodes} from "../common/httpCodes";
import {testServer} from "../../mocks/testServer";
import {rest} from "msw";

const failedRequest = (restMethod, endpoint, statusCode = HttpCodes.badRequest) => {
    testServer.use(restMethod(`http://localhost/api/${endpoint}`,
        (req, res, context) => {
            return res(context.status(statusCode), context.json({error: "error information"}));
        }))
};

describe("api interactions", () => {
    let baseInput;
    let quoteInput;
    let assetsResponse;

    beforeEach(() => {
        render(<CryptoSelection username={"username"}
                                jwt={{token: "mockJwt", expiration: new Date(Date.now() + 10000).toUTCString()}}/>);

        baseInput = screen.getByRole("textbox", {name: "Base Symbol"});
        quoteInput = screen.getByRole("textbox", {name: "Quote Symbol"});
        assetsResponse = screen.getByTestId("validity");
    });
    test("should display checkmark for valid asset pairs", async () => {
        userEvent.type(baseInput, "BTC");
        userEvent.type(quoteInput, "USD");

        await waitFor(() => expect(assetsResponse).toHaveTextContent("✔"));
    });
    test("should display error for invalid asset pairs", async () => {
        failedRequest(rest.get, "asset-pair/:assets/:brokerage", HttpCodes.notFound);
        userEvent.type(baseInput, "BTC");
        userEvent.type(quoteInput, "UD");

        await waitFor(() => expect(assetsResponse).toHaveTextContent("BTCUD is invalid."));
    });

});