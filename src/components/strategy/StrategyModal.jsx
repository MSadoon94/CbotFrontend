import React, {useState} from "react";
import Modal from "react-modal";
import {CryptoSelection} from "./CryptoSelection";
import "./modal.css"
import {apiRequest, headers} from "../api/apiRequest";
import {save} from "../api/responseTemplates";

export const StrategyModal = (props) => {

    const [saveOutcome, setSaveOutcome] = useState();
    const [strategy, setStrategy] = useState({name: "Strategy Name"});

    let config = {
        url: "/api/save-strategy",
        method: "post",
        headers: headers(props.jwt.token),
        username: props.username,
        jwt: props.jwt.token,
        expiration: props.jwt.expiration,
        data: strategy
    };

    let handler = {
        output: null,
        templates: save("Strategy"),
        onSuccess: (res) => {
            handler.output = res
        },
        onFail: (res) => {
            handler.output = res
        }
    };

    const handleSave = async () => {
        await apiRequest(config, handler);
        setSaveOutcome(handler.output.message);
    };

    return (
        <Modal id={"strategyModal"} isOpen={props.isOpen} jwt={props.jwt}
               onRequestClose={() => {
                   props.onRequestClose()
               }}
               appElement={document.getElementById('app')}
               className={"modal"} overlayClassName={"overlay"}
        >
            <h2>Strategy Creator</h2>
            <CryptoSelection jwt={props.jwt}/>
            <input id={"strategyName"} value={strategy.name}
                   onChange={e => setStrategy({...strategy, name: e.target.value})}/>
            <button type={"button"} id={"saveButton"} onClick={handleSave}>Save Strategy</button>
            <output data-testid={"saveOutcome"} id={"saveOutcome"}
                    className={(saveOutcome === "Strategy was saved successfully." ? "checkmark" : "invalid")}>
                {saveOutcome}
            </output>
            <button type={"button"} id={"closeButton"} onClick={() => props.onRequestClose()}>X</button>
        </Modal>
    )
};