import {render, screen} from "@testing-library/react";
import {Exchange} from "./Exchange";
import {mockData} from "../../../mocks/mockData";

let table;

let [[{currency, amount}]] = mockData.formattedExchange.balances;

beforeEach(() => {
    render(<Exchange initial={mockData.formattedExchange}/>);
    table = screen.getByRole("table");
});

test("should display currency in table", () => {
    expect(table).toHaveTextContent(currency);
});

test("should display amount in table", () => {
    expect(table).toHaveTextContent(amount);
});


