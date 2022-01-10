import React, {useState} from "react";
import Modal from "react-modal";
import {CryptoSelection} from "./CryptoSelection";
import {load} from "../api/responseTemplates";
import {apiConfig} from "../api/apiUtil";
import {ApiResponse} from "../api/ApiResponse";
import {DynamicSelect} from "../common/DynamicSelect";
import {strategySelect} from "../common/selectSchemas";
import {loadStrategiesModule, saveStrategyModule} from "./strategyApiModule";
import {RefineStrategy} from "./RefineStrategy";
import "./modal.css"

export const StrategyModal = ({isOpen, onRequestClose}) => {
    let refinements = {
        stopLoss: "",
        maxPosition: "",
        targetProfit: "",
        movingStopLoss: "",
        maxLoss: "",
        longEntry: ""
    }
    const [strategyState, setStrategyState] = useState({
        name: "",
        assets: {base: "", quote: ""},
        refinements
    });
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
        setStrategyState({
            name: body.name,
            assets: {base: body.base, quote: body.quote},
            refinements: getRefinements(body)
        })
    }

    const getRefinements = (body) => {
        let bodyRefinements = {};
        Object.keys(refinements).forEach((type) => bodyRefinements[type] = body[type])
        return bodyRefinements;
    }

    const handleAssetUpdate = (assets) => {
        setStrategyState({...strategyState, base: assets.base, quote: assets.quote});
    }

    const refineUpdate = () => {
        let update = {};
        Object.keys(refinements).forEach(
            (type) => update[type] = (value) => setStrategyState({...strategyState, [type]: value}))
        return update;
    }

    return (
        <div id={"strategyModal"} data-testid={"strategyModal"}>
            <Modal isOpen={isOpen}
                   onRequestClose={() => {
                       onRequestClose()
                   }}
                   appElement={document.getElementById('app')}
                   className={"modal"} overlayClassName={"overlay"}>

                <h2>Strategy Creator</h2>

                <CryptoSelection updateAssets={handleAssetUpdate}
                                 loadedAssets={strategyState.assets}/>

                <div id={"strategyManagement"}>
                    <label htmlFor={"strategyName"}>Strategy Name</label>
                    <input id={"strategyName"} value={strategyState.name}
                           onChange={e => setStrategyState({...strategyState, name: e.target.value})}/>
                    <button type={"button"} id={"saveButton"}
                            onClick={() => setSaveRequest(saveStrategyModule(strategyState))}>Save Strategy
                    </button>
                    <ApiResponse cssId={"saveModal"} request={saveRequest}/>
                    <DynamicSelect selectSchema={strategySelect(handleSelectChange)}
                                   apiModule={loadStrategiesModule}/>
                    <ApiResponse cssId={"loadStrategyRequest"} request={loadStrategyRequest}/>
                </div>

                <button type={"button"} id={"closeButton"} onClick={() => onRequestClose()}>X</button>

                <RefineStrategy update={refineUpdate()} overwrite={strategyState.stopLoss}/>
            </Modal>
        </div>
    )
};
