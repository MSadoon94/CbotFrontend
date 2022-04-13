import {render, screen} from "@testing-library/react";
import {CredentialManager} from "./CredentialManager";
import userEvent from "@testing-library/user-event";

let addSuccess, addFail, rejectCredentials;

beforeEach(() => {
    render(<CredentialManager/>)
    addSuccess = screen.getByRole("button", {name: "AddSuccess"});
    addFail = screen.getByRole("button", {name: "AddFail"});
    rejectCredentials = screen.getByRole("button", {name: "RejectCredentials"});
})

jest.mock("react-stomp", () => ({
    __esModule: true,
    default: (props) => {
        return <div>
            <button id="addSuccess"
                    onClick={() => {
                        props.onMessage({payload: "Exchange added.", headers: {}}, "/app/add-credentials")
                    }}>
                AddSuccess
            </button>
            <button id="addFail"
                    onClick={() => {
                        props.onMessage({payload: "Failed to add exchange:",
                            headers: {Error: true}}, "/app/add-credentials")
                    }}>
                AddFail
            </button>
            <button id="rejectCredentials"
                    onClick={() => {
                        props.onMessage({
                            payload: "Kraken credentials rejected, please enter correct credentials.", headers: {}},
                            "/topic/rejected-credentials")
                    }}>
                RejectCredentials
            </button>
        </div>
    }

}))
test("should display success message on successful exchange addition", () => {
    userEvent.click(addSuccess);

    expect(screen.getByTestId("addCredentialsResponse")).toHaveTextContent("Exchange added.");
})

test("should display fail message on rejected exchange addition", () => {
    userEvent.click(addFail);

    expect(screen.getByTestId("addCredentialsResponse")).toHaveTextContent("Failed to add exchange:");
})

test("should display fail message on rejected credentials update", () => {
    userEvent.click(rejectCredentials);

    expect(screen.getByTestId("rejectedCredentialsResponse"))
        .toHaveTextContent("Kraken credentials rejected, please enter correct credentials.");
})
