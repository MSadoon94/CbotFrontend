import {render, screen, waitFor} from "@testing-library/react";
import {CardLoader} from "./CardLoader";
import {mockData} from "../../mocks/mockData";
import userEvent from "@testing-library/user-event";

let cardSelect, optionName, loadSingleCardButton;

beforeEach(async () => {
    render(
        <CardLoader hasUpdate={true}/>
    );

    cardSelect = screen.getByRole("combobox");
    optionName = () => cardSelect.children.item(0).getAttribute("value");
    userEvent.click(cardSelect);
    await waitFor(() => userEvent.selectOptions(cardSelect, "mockCard1"));
    loadSingleCardButton = screen.getByRole("button", {name: "Load Card"});
});

describe("multiple card loading", () => {

    test("should populate cards with cards connected to user account", async () => {

        await waitFor(() => {
            expect(optionName()).toBe("mockCard1")
        });
    });

});

describe("single card loading", () => {

    test("should require password on selection of option", async () => {
        await waitFor(() => userEvent.selectOptions(cardSelect, "mockCard1"));

        await screen.findByRole("textbox", {name: "Card Password"});
    });

    test("should return card on password acceptance", async () => {
        await loadCard();

        await waitFor(() =>
            expect(screen.getByRole("table")).toHaveTextContent(mockData.card.cardName));
    });

    const loadCard = async () => {
        userEvent.type(await screen.findByRole("textbox", {name: "Card Password"}), "mockPassword");
        userEvent.click(loadSingleCardButton);
    }

});