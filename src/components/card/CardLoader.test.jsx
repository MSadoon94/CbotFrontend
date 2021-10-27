import {render, screen, waitFor} from "@testing-library/react";
import {CardLoader} from "./CardLoader";
import {mockId} from "../../mocks/mockId";
import {ApiManager} from "../api/ApiManager";
import userEvent from "@testing-library/user-event";
import {mockData} from "../../mocks/mockData";

let cardSelect, optionName, loadSingleCardButton;

beforeEach(async () => {
    render(
        <ApiManager userId={mockId}>
            <CardLoader hasUpdate={true}/>
        </ApiManager>
    );

    cardSelect = screen.getByRole("combobox");
    optionName = () => cardSelect.children.item(0).getAttribute("value");
    await waitFor(() => userEvent.selectOptions(cardSelect, "mockCard1"));
    loadSingleCardButton = screen.getByRole("button", {name: "Load Card"});

});

test("should populate cards with cards connected to user account", async () => {
    await waitFor(() => expect(optionName()).toBe("mockCard1"));
});

test("should require password on selection of option", async () => {
    await waitFor(() => userEvent.selectOptions(cardSelect, "mockCard1"));

    await screen.findByRole("textbox", {name: "Card Password"});
});

test("should return specific card name on password acceptance", async () => {
    userEvent.type(await screen.findByRole("textbox", {name: "Card Password"}), "mockPassword");
    userEvent.click(loadSingleCardButton);

    await waitFor(() =>
        expect(screen.getByTestId("cardName0")).toHaveTextContent(mockData.singleCard.cardName));
});

test("should return specific card balance on password acceptance", async () => {
    userEvent.type(await screen.findByRole("textbox", {name: "Card Password"}), "mockPassword");
    userEvent.click(loadSingleCardButton);

    await waitFor(() =>
        expect(screen.getByTestId("cardBalance0")).toHaveTextContent(JSON.stringify(mockData.singleCard.balances)));
});