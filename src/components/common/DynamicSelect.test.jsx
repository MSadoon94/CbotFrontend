import {render, screen, waitFor} from "@testing-library/react";
import {ApiManager} from "../api/ApiManager";
import {mockData, mockId, mockSelectCardsSchema} from "../../mocks/mockData";
import React from "react";
import {DynamicSelect} from "./DynamicSelect";
import userEvent from "@testing-library/user-event";

let select, optionName, outcome, schema, allOptions;

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

beforeEach(async () => {
    schema = mockSelectCardsSchema((selection) => outcome = selection);

    render(
        <ApiManager userId={mockId}>
            <DynamicSelect selectSchema={schema}
                           onOptionsSet={(options) => allOptions = options}/>
        </ApiManager>
    );
    select = screen.getByRole("combobox");
    optionName = () => select.children.item(0).getAttribute("value");
    userEvent.click(select);
});

test("should return all options to parent component", async () => {
    await waitFor(() => expect(allOptions).toStrictEqual(mockData.cards));
})

test("should load options on click", async () => {
    await waitFor(() => userEvent.selectOptions(select, "mockCard1"));

    expect(optionName()).toBe("mockCard1");
})

test("should do default action when default option is clicked", async () => {
    await waitFor(() => userEvent.selectOptions(select, `-- Load ${schema.type} --`));

    expect(outcome).toStrictEqual(schema.defaultAction());
})

test("should do action from schema when option is selected", async () => {

    await waitFor(() => userEvent.selectOptions(select, "mockCard1"));

    expect(outcome).toStrictEqual(schema.doAction("mockCard1"));
})