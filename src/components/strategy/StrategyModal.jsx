import React, {useState} from "react";
import Modal from "react-modal";
import {CryptoSelection} from "./CryptoSelection";
import "./modal.css"
import {load} from "../api/responseTemplates";
import {apiConfig} from "../api/apiUtil";
import {ApiResponse} from "../api/ApiResponse";
import {DynamicSelect} from "../common/DynamicSelect";
import {strategySelect} from "../common/selectSchemas";
import {loadStrategiesModule, saveStrategyModule} from "./strategyApiModule";

export const StrategyModal = ({isOpen, onRequestClose}) => {
    const [loadedStrategy, setLoadedStrategy] = useState({loadedAssets: {base: "", quote: ""}});
    const [strategyState, setStrategyState] = useState({name: ""});
    const [saveRequest, setSaveRequest] = useState();
    const [loadStrategyRequest, setLoadStrategyRequest] = useState();

    const handleSelectChange = (selection) => {
        let config = apiConfig({url: `/api/load-strategy/${selection}`, method: "get"}, null);

        let actions = {
            onComplete: {
                success: (response) => setModalChanges(response),
                fail: () => null
            }
        }
        setLoadStrategyRequest({config, templates: load("Strategy"), actions});
    }

    const setModalChanges = (response) => {
        let {body} = response;
        setStrategyState({...strategyState, name: body.name})
        setLoadedStrategy({loadedAssets: {base: body.base, quote: body.quote}})
    }

    return (
        <Modal id={"strategyModal"} isOpen={isOpen}
               onRequestClose={() => {
                   onRequestClose()
               }}
               appElement={document.getElementById('app')}
               className={"modal"} overlayClassName={"overlay"}>
            <h2>Strategy Creator</h2>
            <CryptoSelection loadedAssets={loadedStrategy.loadedAssets}/>
            <label htmlFor={"strategyName"}>Strategy Name</label>
            <input id={"strategyName"} value={strategyState.name}
                   onChange={e => setStrategyState({...strategyState, name: e.target.value})}/>
            <button type={"button"} id={"saveButton"}
                    onClick={() => setSaveRequest(saveStrategyModule(strategyState))}>Save Strategy
            </button>
            <ApiResponse cssId={"saveModal"} request={saveRequest}/>
            <button type={"button"} id={"closeButton"} onClick={() => onRequestClose()}>X</button>

            <DynamicSelect selectSchema={strategySelect(handleSelectChange)} apiModule={loadStrategiesModule}/>
            <ApiResponse cssId={"loadStrategyRequest"} request={loadStrategyRequest}/>
        </Modal>
    )
};