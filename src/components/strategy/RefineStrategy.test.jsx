import {render, screen, waitFor} from "@testing-library/react";
import {RefineStrategy} from "./RefineStrategy";
import userEvent from "@testing-library/user-event";

let stopLossInput;
let output;
let update = {
    stopLoss: (value) => output = value,
}

beforeEach(() => {
    render(<RefineStrategy update={update}/>)
    stopLossInput = screen.getByRole("spinbutton", {name: "Stop-Loss"})
})
test("should return stop loss on change",  async () => {
    userEvent.type(stopLossInput, "100");

    await waitFor(() => expect(output).toBe("100"));
})