import React from "react";
import {render, screen} from "@testing-library/react";
import {StrategyModal} from "./StrategyModal";
import ReactModal from "react-modal";

ReactModal.setAppElement(document.createElement('div'));

describe("sections", () => {

    beforeEach(() => {
        render(<StrategyModal isOpen={true}/>);
    });

    test("should have crypto selection section", () => {
        screen.getByRole("heading",{name: "Crypto Selection"});
    })

});