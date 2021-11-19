import React, {useState} from "react";
import Modal from "react-modal";
import {CryptoSelection} from "./CryptoSelection";
import "./modal.css"
import {save} from "../api/responseTemplates";
import {apiConfig} from "../api/apiUtil";
import {ApiResponse} from "../api/ApiResponse";

export const StrategyModal = ({isOpen,  onRequestClose}) => {
    const [strategy, setStrategy] = useState({name: "Strategy Name"});
    const [request, setRequest] = useState();

    let config = apiConfig({url: "/api/save-strategy", method: "post"}, strategy);

    const handleSave = () => {
        setRequest({config, templates: save("Strategy")});
    };

    return (
        <Modal id={"strategyModal"} isOpen={isOpen}
               onRequestClose={() => {
                   onRequestClose()
               }}
               appElement={document.getElementById('app')}
               className={"modal"} overlayClassName={"overlay"}>
            <h2>Strategy Creator</h2>
            <CryptoSelection/>
            <input id={"strategyName"} value={strategy.name}
                   onChange={e => setStrategy({...strategy, name: e.target.value})}/>
            <button type={"button"} id={"saveButton"} onClick={handleSave}>Save Strategy</button>
            <ApiResponse cssId={"saveModal"} request={request}/>
            <button type={"button"} id={"closeButton"} onClick={() => onRequestClose()}>X</button>
        </Modal>
    )
};