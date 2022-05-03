import {render, screen, waitFor} from "@testing-library/react";
import {mockData} from "../../mocks/mockData";
import React from "react";
import {DynamicSelect} from "./DynamicSelect";
import userEvent from "@testing-library/user-event";
import {strategySelectSchema} from "./selectSchemas";

let select, optionName, outcome, schema, allOptions;

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

beforeEach(async () => {
    let onChange = (selection) => outcome = selection;
    schema = strategySelectSchema(onChange);

    outcome = null;

    render(
        <DynamicSelect selectSchema={schema}
                       onOptionsSet={(options) => allOptions = options}/>
    );
    select = screen.getByRole("combobox");
    optionName = () => select.children.item(0).getAttribute("value");
    userEvent.click(select);
});

test("should return all options to parent component", async () => {
    await waitFor(() => expect(allOptions).toStrictEqual(mockData.strategies));
})

test("should load options on click", async () => {
    await waitFor(() => userEvent.selectOptions(select, "MockStrategy1"));

    expect(optionName()).toBe("MockStrategy1");
})

test("should do action from schema when option is selected", async () => {

    await waitFor(() => userEvent.selectOptions(select, "MockStrategy1"));

    expect(outcome).toStrictEqual(schema.doAction("MockStrategy1"));
})