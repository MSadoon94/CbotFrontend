import {render, screen, waitFor} from "@testing-library/react";
import {RefineStrategy} from "./RefineStrategy";
import userEvent from "@testing-library/user-event";

let inputValue = "100";
let output;

const assignOutput = (value) => {
    output = value;
}
let refinements = ["stopLoss", "maxPosition", "targetProfit",
    "movingStopLoss", "maxLoss", "entry"]
let update = {};

beforeEach(() => {
    refinements.forEach((type) => update[type] = assignOutput);
    render(<RefineStrategy update={update}/>)
})

test.concurrent.each`
    refinement              | inputName      
    ${"stop loss"}          | ${"Stop-Loss"}       
    ${"max position"}       | ${"Max Position"}     
    ${"target profit"}      | ${"Target Profit"}    
    ${"moving stop loss"}   | ${"Moving Stop-Loss"} 
    ${"max loss"}           | ${"Max Loss"}         
    ${"entry"}              | ${"Entry %"}       
    `("should return $refinement on change", async ({inputName}) => {
        let input = screen.getByRole("spinbutton", {name: inputName});

        userEvent.type(input, inputValue);

        await waitFor(() => expect(output).toBe(inputValue));
})