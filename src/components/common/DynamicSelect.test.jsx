import {render, screen, waitFor} from "@testing-library/react";
import {ApiManager} from "../api/ApiManager";
import {mockId, mockSelectCardsSchema} from "../../mocks/mockData";
import React from "react";
import {DynamicSelect} from "./DynamicSelect";
import {mockCardsApiModule} from "../../mocks/mockApiModules";
import userEvent from "@testing-library/user-event";

let select, optionName, outcome, schema;

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

beforeEach(async () => {
    schema = mockSelectCardsSchema((selection) => outcome = selection);

    render(
        <ApiManager userId={mockId}>
            <DynamicSelect selectSchema={schema} apiModule={mockCardsApiModule}/>
        </ApiManager>
    );
    select = screen.getByRole("combobox");
    optionName = () => select.children.item(0).getAttribute("value");
    userEvent.click(select);
});

test("should load options on click", async () => {
    await waitFor(() => userEvent.selectOptions(select, "mockCard1"));

    expect(optionName()).toBe("mockCard1");
    console.log(outcome);
})

test("should do default action when default optionNap is clicked", async () => {
    await waitFor(() => userEvent.selectOptions(select, `-- Load ${schema.type} --`));

    expect(outcome).toStrictEqual(schema.defaultAction());
})

test("should do action from schema when optionNap is selected", async () => {
    let mockSelection = {
        target: {
            value: "mockCard1"
        }
    }
    await waitFor(() => userEvent.selectOptions(select, "mockCard1"));

    expect(outcome).toStrictEqual(schema.doAction(mockSelection))
})