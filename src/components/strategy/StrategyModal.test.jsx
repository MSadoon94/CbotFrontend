import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {StrategyModal} from "./StrategyModal";
import ReactModal from "react-modal";
import userEvent from "@testing-library/user-event";

ReactModal.setAppElement(document.createElement('div'));

let isOpen;

beforeEach(() => {
    isOpen = true;
    render(<StrategyModal isOpen={isOpen} username={"username"}
                          jwt={{token: "mockJwt", expiration: new Date(Date.now() + 10000).toUTCString()}}
                          onRequestClose={() => {
                              isOpen = false
                          }}/>);
});

describe("modal actions", () => {
    let closeButton, saveButton, saveOutcome;

    beforeEach(() => {
        closeButton = screen.getByRole("button", {name: "X"});
        saveButton = screen.getByRole("button", {name: "Save Strategy"});
        saveOutcome = screen.getByTestId("saveOutcome");
    });

    test("should close modal when exit button is clicked", async () => {
        userEvent.click(closeButton);

        await waitFor(() => {expect(isOpen).toBe(false)});
    });

    test("should save strategy when save button is clicked", async () => {
        userEvent.click(saveButton);

        await waitFor(() => {expect(saveOutcome).toHaveTextContent("Strategy was saved successfully.")})
    });

});

describe("sections", () => {

    test("should have crypto selection section", () => {
        screen.getByRole("heading", {name: "Crypto Selection"});
    })

});