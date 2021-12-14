import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {DynamicTextBox} from "./DynamicTextBox";
import userEvent from "@testing-library/user-event";

let textBox;
let update;


beforeEach(() => {
    render(<DynamicTextBox timeout={500} onTyping={(res) => {
        update = res
    }} overwrite={"overwrite"}/>);
    textBox = screen.getByRole("textbox");
});

test("should return text box", () => {
    expect(textBox).toBeVisible();
});

test("should update parent when user finishes typing", async () => {
    userEvent.clear(textBox);
    userEvent.type(textBox, "TestEntry");
    await waitFor(() => {
        expect(update.isTyping).toBe(false)
    })
});

test("should return typed text", async () => {
    userEvent.clear(textBox);
    userEvent.type(textBox, "TestEntry");
    await waitFor(() => {
        expect(update.entry).toBe("TestEntry")
    });
});
test("should overwrite value when passed by parent", async () => {
    await waitFor(() => expect(textBox).toHaveValue("overwrite"));
})


