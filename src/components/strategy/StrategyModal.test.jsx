import React from "react";
import {render, screen} from "@testing-library/react";
import {StrategyModal} from "./StrategyModal";
import ReactModal from "react-modal";

ReactModal.setAppElement(document.createElement('div'));

describe("sections", () => {

    beforeEach(() => {
        let isOpen = true;
        render(<StrategyModal isOpen={isOpen} username={"username"}
                              jwt={{token: "mockJwt", expiration: new Date(Date.now() + 10000).toUTCString()}}
                              onRequestClose={() => {
                                  isOpen = false
                              }}/>);
    });

    test("should have crypto selection section", () => {
        screen.getByRole("heading", {name: "Crypto Selection"});
    })

});