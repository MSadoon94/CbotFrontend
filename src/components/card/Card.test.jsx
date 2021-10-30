import userEvent from "@testing-library/user-event";
import {render, screen, waitFor} from "@testing-library/react";
import {Card} from "./Card";
import {mockData} from "../../mocks/mockData";

let table, hideButton, closeButton;

let [[{currency, amount}]] = mockData.formattedCard.balances;

beforeEach(() => {
    render(<Card cardData={mockData.formattedCard}/>);
    table = screen.getByRole("table");
    hideButton = screen.getByRole("button", {name: "Hide"});
    closeButton = screen.getByRole("button", {name: "X"});
});

test("should toggle card visibility on click", async () => {
    userEvent.click(hideButton);

    await waitFor(() => expect(table).not.toBeVisible());

    userEvent.click(screen.getByRole("button", {name: "Show"}));

    await waitFor(() => expect(table).toBeVisible());
});

test("should remove card on click", async () => {
    userEvent.click(closeButton);

    await waitFor(() => {
        expect(table).not.toBeVisible();
        expect(hideButton).not.toBeVisible();
        expect(closeButton).not.toBeVisible();
    })
});

test("should display currency in table", () => {
    expect(table).toHaveTextContent(currency);
});

test("should display amount in table", () => {
    expect(table).toHaveTextContent(amount);
});


