import React from "react";
import {render, screen} from "@testing-library/react";
import {CryptoSelection} from "./CryptoSelection";
import userEvent from "@testing-library/user-event";

describe("api interactions", () => {
    let baseInput;
    let quoteInput;
    let assetsResponse;

    beforeEach(() => {
        render(<CryptoSelection/>);

        baseInput = screen.getByRole("input", {name: "Base Symbol"});
        quoteInput = screen.getByRole("input", {name: "Quote Symbol"});
        assetsResponse = screen.getByTestId("assetsResponse");
    });
    test("should respond with checkmark for valid asset pairs", async () => {
        userEvent.type(baseInput, "BTC");
        userEvent.type(quoteInput, "BTC");

        expect(assetsResponse).toBe("✔")
    })

});