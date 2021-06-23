import React from "react";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {Home} from "./Home";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => ({
        state: "jwt"
    })
}));

describe("kraken form", () => {
    let brokerageSelect;

    beforeEach(() => {
        render(<Home />);
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

