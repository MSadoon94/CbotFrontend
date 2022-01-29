import React, {useRef} from "react";
import Modal from "react-modal";
import {CryptoSelection} from "./CryptoSelection";
import {DynamicSelect} from "../common/DynamicSelect";
import {strategySelect} from "../common/selectSchemas";
import {loadStrategyModule, saveStrategyModule, strategyIds} from "./strategyApiModule";
import {RefineStrategy} from "./RefineStrategy";
import "./modal.css"
import {useApi} from "../api/useApi";

export const StrategyModal = ({isOpen, onRequestClose}) => {
    let refinements = {
        stopLoss: "",
        maxPosition: "",
        targetProfit: "",
        movingStopLoss: "",
        maxLoss: "",
        longEntry: ""
    }

    const strategy = useRef({
        name: "",
        assets: {base: "", quote: ""},
        refinements
    });
    const [sendStrategyRequest, strategyResponse] = useApi()
    const [sendSaveRequest, , saveResponse] = useApi();

    const handleSelectChange = (selection) => {
        sendStrategyRequest(loadStrategyModule(selection, {
            onComplete: {
                success: (response) => setModalChanges(response),
                fail: () => null
            }
        }));
    }

    const setModalChanges = (response) => {
        let {body} = response;
        strategy.current = {
            name: body.name,
            assets: {base: body.base, quote: body.quote},
            refinements: getRefinements(body)
        }
    }

    const getRefinements = (body) => {
        let bodyRefinements = {};
        Object.keys(refinements).forEach((type) => bodyRefinements[type] = body[type])
        return bodyRefinements;
    }

    const handleAssetUpdate = (assets) => {
        strategy.current = {...strategy.current, base: assets.base, quote: assets.quote}
    }

    const refineUpdate = () => {
        let update = {};
        Object.keys(refinements).forEach(
            (type) => update[type] = (value) => strategy.current = {...strategy.current, [type]: value})
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
                                 loadedAssets={strategy.current.assets}/>

                <div id={"strategyManagement"}>
                    <label htmlFor={"strategyName"}>Strategy Name</label>
                    <input id={"strategyName"} value={strategy.current.name}
                           onChange={e => strategy.current = {...strategy.current, name: e.target.value}}/>

                    <button type={"button"} id={"saveStrategyButton"}
                            onClick={() => sendSaveRequest(saveStrategyModule(strategy.current))}
                    >Save Strategy
                    </button>
                    <output id={strategyIds.saveStrategy} data-testid={strategyIds.saveStrategy}
                            data-issuccess={saveResponse.isSuccess}>{saveResponse.message}</output>

                    <DynamicSelect selectSchema={strategySelect(handleSelectChange)}/>

                    <output id={strategyIds.loadStrategy} data-testid={strategyIds.loadStrategy}
                            data-issuccess={strategyResponse.isSuccess}>{strategyResponse.message}</output>
                </div>

                <button type={"button"} id={"closeButton"} onClick={() => onRequestClose()}>X</button>

                <RefineStrategy update={refineUpdate()} overwrite={strategy.current.refinements}/>
            </Modal>
        </div>
    )
};
