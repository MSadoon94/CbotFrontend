import {render, screen} from "@testing-library/react";
import {StatusWidget} from "./StatusWidget";

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

test("should display entry found message", () => {

})