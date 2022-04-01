import React, {useState} from "react";
import Modal from "react-modal";
import {CryptoSelection} from "./CryptoSelection";
import {DynamicSelect} from "../common/DynamicSelect";
import {strategySelectSchema} from "../common/selectSchemas";
import {loadStrategyModule, saveStrategyModule, strategyIds} from "./strategyApiModule";
import {RefineStrategy} from "./RefineStrategy";
import "./modal.css"
import {useApi} from "../api/useApi";
import {validation} from "../api/responseTemplates";

export const StrategyModal = ({isOpen, onRequestClose}) => {
    const exchanges = {kraken: "KRAKEN"};
    const timeUnits = ["Second", "Minute", "Hour", "Day", "Week", "Month", "Year"];
    let refinements = {
        stopLoss: "",
        maxPosition: "",
        targetProfit: "",
        movingStopLoss: "",
        maxLoss: "",
        entry: ""
    }

    const [strategy, setStrategy] = useState({
        name: "",
        type: "long",
        exchange: "",
        timeFrame: "",
        timeUnit: "",
        assets: {base: "", quote: ""},
        refinements
    });
    const [sendStrategyRequest, strategyResponse, ,] = useApi()
    const [sendSaveRequest, saveResponse, ,] = useApi();

    const handleSelectChange = async (selection) => {
        await sendStrategyRequest(loadStrategyModule(selection))
            .then((res) => setModalChanges(res));
    }

    const setModalChanges = (response) => {
        let {body} = response;
        setStrategy({
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
        setStrategy({...strategy, base: assets.base, quote: assets.quote})
    }

    const refineUpdate = () => {
        let update = {};
        Object.keys(refinements).forEach(
            (type) => update[type] = ((value) => setStrategy({...strategy, [type]: value})))
        return update;
    }

    const isValidExchange = (exchange) => {
        if (exchange) {
            return Object.keys(exchanges).includes(exchange.trim().toLowerCase());
        } else {
            return false;
        }
    }

    const checkExchange = (exchange) => {
        let response = validation(strategy.exchange);

        if (!strategy.exchange) {
            return "Exchange must be entered.";
        } else if (isValidExchange(strategy.exchange)) {
            return response.success;
        } else {
            return response.fail;
        }
    }

    return (
        <Modal id="strategyModal" data-testid="strategyModal"
               isOpen={isOpen}
               onRequestClose={() => {
                   onRequestClose()
               }}
               appElement={document.getElementById('app')}
               className="modal" overlayClassName="overlay">

            <h2>Strategy Creator</h2>

            <CryptoSelection
                exchange={strategy.exchange}
                updateAssets={handleAssetUpdate}
                loadedAssets={strategy.assets}
            />

            <div id="strategyManagement">
                <label htmlFor="strategyName">Strategy Name</label>
                <input id="strategyName" value={strategy.name}
                       onChange={e => setStrategy({...strategy, name: e.target.value})}/>

                <button type="button" id="saveStrategyButton"
                        onClick={() => sendSaveRequest(saveStrategyModule(strategy))}
                >Save Strategy
                </button>
                <output id={strategyIds.saveStrategy} data-testid={strategyIds.saveStrategy}
                        data-issuccess={saveResponse.isSuccess}>{saveResponse.message}</output>

                <DynamicSelect selectSchema={strategySelectSchema(handleSelectChange)}/>

                <output id={strategyIds.loadStrategy} data-testid={strategyIds.loadStrategy}
                        data-issuccess={strategyResponse.isSuccess}>{strategyResponse.message}</output>
            </div>

            <div className="strategyDetails">
                <h3>Strategy Details</h3>

                <label htmlFor="strategyExchangeInput">Exchange</label>
                <input id="strategyExchangeInput" value={strategy.exchange}
                       onChange={e => setStrategy({...strategy, exchange: e.target.value})}/>
                <output id="exchangeResponse" data-testid="exchangeResponse"
                        data-issuccess={isValidExchange(strategy.exchange)}>
                    {checkExchange(strategy.exchange)}
                </output>

                <label htmlFor="strategyTypeSelect">Strategy Type</label>
                <select id="strategyTypeSelect">
                    <option onClick={() => setStrategy({...strategy, type: "long"})}>Long</option>
                    <option onClick={() => setStrategy({...strategy, type: "short"})}>Short</option>
                </select>


                <label htmlFor="strategyTimeFrameInput">Time Frame</label>
                <input type="number" min="0" id="strategyTimeFrameInput" value={strategy.timeFrame}
                       onChange={e => setStrategy({...strategy, timeFrame: e.target.value})}/>

                <label htmlFor="timeUnitSelect">Time Unit</label>
                <select id="timeUnitSelect">
                    {timeUnits.map(
                        unit =>
                            <option
                                onClick={() => setStrategy({...strategy, timeUnit: unit.toLowerCase()})}>
                                {unit}
                            </option>
                    )}

                </select>
            </div>

            <button type="button" id="closeButton" onClick={() => onRequestClose()}>X</button>

            <RefineStrategy update={refineUpdate()} overwrite={strategy.refinements}/>
        </Modal>
    )
};
