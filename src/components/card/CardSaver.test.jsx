import {render, screen, waitFor} from "@testing-library/react";
import {CardSaver} from "./CardSaver";
import userEvent from "@testing-library/user-event";
import {save} from "../api/responseTemplates";
import {rest} from "msw";
import {HttpStatus} from "../common/httpStatus";
import {failedRequest} from "../../mocks/apiMocks";

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

describe("save card requests", () => {

    let cardNameInput, accountInput, cardPasswordInput, brokerageInput, saveCardButton, saveCardResponse;

    beforeEach(() => {
        render(
            <CardSaver/>
        );

        cardNameInput = screen.getByRole("textbox", {name: "Card Name"});
        accountInput = screen.getByRole("textbox", {name: "Account"});
        cardPasswordInput = screen.getByRole("textbox", {name: "Password"});
        brokerageInput = screen.getByRole("textbox", {name: "Brokerage"});
        saveCardButton = screen.getByRole("button", {name: "Save Card"});
        saveCardResponse = screen.getByTestId("saveCardResponse");

        userEvent.type(cardNameInput, "mockName");
        userEvent.type(accountInput, "mockAccount");
        userEvent.type(cardPasswordInput, "mockPassword");
        userEvent.type(brokerageInput, "mockBrokerage");
    });
    test("should respond to successful card saving by displaying success message", async () => {
        userEvent.click(saveCardButton);
        await waitFor(() => expect(saveCardResponse).toHaveTextContent(save("Card").success));
    });

    test("should respond to failed card saving by displaying fail message", async () => {
        failedRequest(rest.post, "api/user/card", HttpStatus.badRequest);

        userEvent.click(saveCardButton);

        await waitFor(() => expect(saveCardResponse).toHaveTextContent(save("Card").fail));
    })
});