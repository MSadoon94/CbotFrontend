import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {DynamicTextBox} from "./DynamicTextBox";
import userEvent from "@testing-library/user-event";

describe("dynamic text box", () => {

    let textBox;
    let update;


    beforeEach(() => {
        render(<DynamicTextBox onTyping={(res) => {update = res}}/>);
        textBox = screen.getByRole("textbox");
        userEvent.type(textBox, "TestEntry");
    });

    test("should return text box", () => {
        expect(textBox).toBeVisible();
    });

    test("should update parent when user finishes typing", async () => {
        await waitFor(() => {expect(update.isTyping).toBe(false)})
    });

    test("should return typed text", async () => {
        await waitFor(() => {expect(update.entry).toBe("TestEntry")});
    })
});