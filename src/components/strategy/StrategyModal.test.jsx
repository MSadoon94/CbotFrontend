import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {StrategyModal} from "./StrategyModal";
import ReactModal from "react-modal";
import userEvent from "@testing-library/user-event";
import {ApiManager} from "../api/ApiManager";
import {mockId} from "../../mocks/mockId";


ReactModal.setAppElement(document.createElement('div'));

let isOpen;

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

beforeEach(() => {
    isOpen = true;
    render(
        <ApiManager userId={mockId}>
            <StrategyModal isOpen={isOpen} onRequestClose={() => {
                isOpen = false
            }}/>
        </ApiManager>
    );
});



describe("modal actions", () => {
    let closeButton, saveButton, response;

    beforeEach(() => {
        closeButton = screen.getByRole("button", {name: "X"});
        saveButton = screen.getByRole("button", {name: "Save Strategy"});
        response = screen.getByTestId("saveModal");
    });

    test("should close modal when exit button is clicked", async () => {
        userEvent.click(closeButton);

        await waitFor(() => {
            expect(isOpen).toBe(false)
        });
    });

    test("should save strategy when save button is clicked", async () => {
        userEvent.click(saveButton);

        await waitFor(() => expect(response).toHaveTextContent("Strategy was saved successfully."));
    });
});

describe("sections", () => {

    test("should have crypto selection section", () => {
        screen.getByRole("heading", {name: "Crypto Selection"});
    })

});