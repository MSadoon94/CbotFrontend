import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {Home} from "./Home";
import ReactModal from 'react-modal'
import {ApiManager} from "../api/ApiManager";
import {mockId} from "../../mocks/mockData";

ReactModal.setAppElement(document.createElement('div'));

beforeEach(() => {
    render(
        <ApiManager userId={mockId}>
            <Home/>
        </ApiManager>
    );
});

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

describe("card saving features", () => {
    let newCardButton;

    beforeEach(() => {
        newCardButton = screen.getByRole("button", {name: "New Card"});
    });
    test("should show save card component when new card button is clicked", async() => {
        userEvent.click(newCardButton);

        await screen.findByText("Card Name");
    });

    test("should hide save card component when cancel card button is clicked", async () => {
       userEvent.click(newCardButton);
       userEvent.click(screen.getByRole("button", {name: "Close Card"}));

       await expect(screen.getByText("Card Name")).not.toBeVisible();
    });

});

describe("strategy modal features", () => {

    let strategyButton;

    beforeEach(() => {
        strategyButton = screen.getByRole("button", {name: "New Strategy"});
    });

    test("should pop-up strategy modal after being clicked", async () => {
        userEvent.click(strategyButton);
        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeVisible()
        });
    });

});

