import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {Home} from "./Home";
import ReactModal from 'react-modal'
import {ApiManager} from "../api/ApiManager";
import {mockId} from "../../mocks/mockId";

ReactModal.setAppElement(document.createElement('div'));

beforeEach(() => {
    render(
        <ApiManager userId={mockId}>
            <Home/>
        </ApiManager>
    );
});

describe("kraken form", () => {
    let brokerageSelect;

    beforeEach(() => {
        brokerageSelect = screen.getByRole("combobox", {name: "Add Brokerage"});
        userEvent.selectOptions(brokerageSelect, ["Kraken"]);
    });

    test("should create text box for api key", () => {
        expect(screen.getByRole("textbox", {name: "API Key"})).toBeVisible();
    });

    test("should create text box for private key", () => {
        expect(screen.getByRole("textbox", {name: "Private Key"})).toBeVisible();
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

