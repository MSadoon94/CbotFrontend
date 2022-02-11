import {render, screen, waitFor} from "@testing-library/react";
import {mockData} from "../../mocks/mockData";
import React from "react";
import {DynamicSelect} from "./DynamicSelect";
import userEvent from "@testing-library/user-event";
import {cardSelectSchema} from "./selectSchemas";

let select, optionName, outcome, schema, allOptions;

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

beforeEach(async () => {
    let onDefault = () => outcome = "default";
    let onChange = (selection) => outcome = selection;
    schema = cardSelectSchema({onDefault, onChange});

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
    await waitFor(() => expect(allOptions).toStrictEqual(mockData.cards));
})

test("should load options on click", async () => {
    await waitFor(() => userEvent.selectOptions(select, "mockCard1"));

    expect(optionName()).toBe("mockCard1");
})

test("should do default action when default option is clicked", async () => {
    await waitFor(() => userEvent.selectOptions(select, `-- Load ${schema.type} --`));

    expect(outcome).toStrictEqual("default");
})

test("should do action from schema when option is selected", async () => {

    await waitFor(() => userEvent.selectOptions(select, "mockCard1"));

    expect(outcome).toStrictEqual(schema.doAction("mockCard1"));
})