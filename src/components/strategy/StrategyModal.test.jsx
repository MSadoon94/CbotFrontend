import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {StrategyModal} from "./StrategyModal";
import ReactModal from "react-modal";
import userEvent from "@testing-library/user-event";
import {messages, mockData, wsClient} from "../../mocks/mockData";
import {strategyIds} from "./strategyApiModule";
import {validation} from "../api/responseTemplates";
import {WebSocketContext} from "../../App";

ReactModal.setAppElement(document.createElement('div'));

let isOpen;

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

let expectedMessage;
const getExpectedMessage = (msg) => expectedMessage = msg;

beforeEach(() => {
    isOpen = true;
    render(
        <WebSocketContext.Provider value={{wsMessages: messages(), wsClient: wsClient(getExpectedMessage)}}>
            <StrategyModal isOpen={isOpen}
                           onRequestClose={() => isOpen = false}/>
        </WebSocketContext.Provider>
    );
});


describe("modal actions", () => {
    let closeButton, saveButton, response, exchangeInput, exchangeStatus;

    beforeEach(() => {
        closeButton = screen.getByRole("button", {name: "X"});
        saveButton = screen.getByRole("button", {name: "Save Strategy"});
        response = screen.getByTestId(strategyIds.saveStrategy);
        exchangeInput = screen.getByRole("textbox", {name: "Exchange"});
        exchangeStatus = screen.getByTestId("exchangeResponse");
    });

    test("should close modal when exit button is clicked", async () => {
        userEvent.click(closeButton);

        await waitFor(() => {
            expect(isOpen).toBe(false)
        });
    });

    test("should save strategy when save button is clicked", async () => {
        userEvent.click(saveButton);

        await waitFor(() => expect(response).toHaveTextContent("Strategy was saved successfully."));
    });

    test("should return success response when exchange is valid", async () => {
        userEvent.type(exchangeInput, "kraken");

        await waitFor(() => expect(exchangeStatus).toHaveTextContent(validation("Exchange").success));
    })

    test("should return error message when exchange is not entered", async () => {
        userEvent.type(exchangeInput, "")

        await waitFor(() => expect(exchangeStatus).toHaveTextContent("Exchange must be entered."))
    })

    test("should return error message when exchange is not compatible", async () => {
        userEvent.type(exchangeInput, "krake")

        await waitFor(() => expect(exchangeStatus).toHaveTextContent("krake is invalid."))
    })
});

describe("dynamic select related behavior", () => {

    let strategySelect;
    let mockStrategy = mockData.strategy;
    const refinements = {
        stopLoss: "Stop-Loss",
        maxPosition: "Max Position",
        targetProfit: "Target Profit",
        movingStopLoss: "Moving Stop-Loss",
        maxLoss: "Max Loss",
        entry: "Entry %"
    }

    beforeEach(async () => {
        strategySelect = screen.getByTestId("loadStrategiesSelect");
        userEvent.click(strategySelect);
        await waitFor(() => userEvent.selectOptions(strategySelect, mockStrategy.name));
    });

    test("should display message on success of load strategy request", async () => {
        await waitFor(() => expect(screen.getByTestId(strategyIds.loadStrategy))
            .toHaveTextContent("Strategy was loaded successfully."));
    })

    test("should load target strategy name when selected for load", async () => {
        await waitFor(() => expect(screen.getByRole("textbox", {name: "Strategy Name"}))
            .toHaveValue(mockStrategy.name));
    })

    test("should load assets when strategy selected for load", async () => {
        await waitFor(() => expect(screen.getByRole("textbox", {name: "Base Symbol"}))
            .toHaveValue(mockStrategy.base));
        await waitFor(() => expect(screen.getByRole("textbox", {name: "Quote Symbol"}))
            .toHaveValue(mockStrategy.quote));
    })
    test("should load refinements when strategy selected for load", async () => {
        await waitFor(() => {
            for (let type in refinements) {
                expect(screen.getByRole("spinbutton", {name: refinements[type]}))
                    .toHaveValue(parseInt(mockStrategy[type]))
            }
        })
    })
})