import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {Home} from "./Home";
import ReactModal from 'react-modal'

ReactModal.setAppElement(document.createElement('div'));

let user = {
    username: "username",
    password: "password",
    authority: "USER",
    jwt: "jwt",
    expiration: "expiration",
    outcome: ""
};


jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => ({
        state: user
    }),
    useHistory: () => ({
        push: jest.fn()
    })
}));

jest.mock("../user/UserApi");

window.alert = jest.fn();

describe("kraken form", () => {
    let brokerageSelect;

    beforeEach(() => {
        render(<Home/>);
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

describe("new strategy button",  () => {

    test("should pop-up strategy modal after being clicked", async () => {
        render(<Home/>);
        let strategyButton = screen.getByRole("button", {name: "New Strategy"});
        userEvent.click(strategyButton);
        await waitFor(() => {expect(screen.getByRole("dialog")).toBeVisible()});
    })

});

