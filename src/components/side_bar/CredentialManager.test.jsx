import {render, screen, waitFor} from "@testing-library/react";
import {CredentialManager} from "./CredentialManager";
import {messages, wsClient} from "../../mocks/mockData";
import {WebSocketContext} from "../../App";

let expectedMessage;
const getExpectedMessage = (msg) => expectedMessage = msg;

const cleanRender = (messages) => render(
    <WebSocketContext.Provider value={{wsMessages: messages, wsClient: wsClient(getExpectedMessage)}}>
        <CredentialManager/>
    </WebSocketContext.Provider>)


test("should display success message on successful exchange addition", () => {
    cleanRender(messages());
    expect(screen.getByTestId("addCredentialsResponse")).toHaveTextContent("KRAKEN added successfully.");
})

test("should display fail message on rejected credentials", async () => {
    let wsMessages = {
        ...messages(), "/topic/rejected-credentials": {
            exchange: "KRAKEN",
            message: "KRAKEN responded with: [EAPI:Invalid key]"
        }
    };
    cleanRender(wsMessages);
    await waitFor(() => expect(screen.getByTestId("rejectedCredentialsResponse"))
        .toHaveTextContent("KRAKEN responded with: [EAPI:Invalid key]"));
})
