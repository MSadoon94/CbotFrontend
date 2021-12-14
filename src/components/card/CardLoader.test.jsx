import {render, screen, waitFor} from "@testing-library/react";
import {CardLoader} from "./CardLoader";
import {mockId} from "../../mocks/mockData";
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

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

describe("multiple card loading", () => {

    test("should populate cards with cards connected to user account", async () => {
        await waitFor(() => expect(optionName()).toBe("mockCard1"));
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
            expect(screen.getByRole("table")).toHaveTextContent(mockData.singleCard.cardName));
    });

    const loadCard = async () => {
        userEvent.type(await screen.findByRole("textbox", {name: "Card Password"}), "mockPassword");
        userEvent.click(loadSingleCardButton);
    }

});