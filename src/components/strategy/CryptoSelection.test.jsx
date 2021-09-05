import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {CryptoSelection} from "./CryptoSelection";
import userEvent from "@testing-library/user-event";

describe("api interactions", () => {
    let baseInput;
    let quoteInput;
    let assetsResponse;

    beforeEach(() => {
        render(<CryptoSelection username={"username"} jwt={{token: "mockJwt", expiration: new Date(Date.now() + 10000).toUTCString()}}/>);

        baseInput = screen.getByRole("textbox", {name: "Base Symbol"});
        quoteInput = screen.getByRole("textbox", {name: "Quote Symbol"});
        assetsResponse = screen.getByTestId("validity");
    });
    test("should display checkmark for valid asset pairs", async () => {
        userEvent.type(baseInput, "BTC");
        userEvent.type(quoteInput, "USD");

        await waitFor(() => expect(assetsResponse).toHaveTextContent("✔"));
    });

});