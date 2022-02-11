import {render, screen, waitFor} from "@testing-library/react";
import {StatusWidget} from "./StatusWidget";
import userEvent from "@testing-library/user-event";

let powerButton, buttonProgress;

beforeEach(() => {
    render(
        <StatusWidget/>
    )
    powerButton = screen.getByRole("button");
    buttonProgress = powerButton.getElementsByClassName("button-progress").item(0);
})

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

test("should start transition on load", () => {
    expect(buttonProgress).toHaveAttribute("data-transition", "true");
})

test("should start transition on power button press", async () => {
    await waitFor(() => expect(buttonProgress).toHaveAttribute("data-transition", "false"));

    userEvent.click(powerButton);

    await waitFor(() => expect(buttonProgress).toHaveAttribute("data-transition", "true"));
})
test("should disable button on power button press", async () => {
    userEvent.click(powerButton);

    await waitFor(() => expect(powerButton).toBeDisabled());
})
test("should display entry found message", () => {

})