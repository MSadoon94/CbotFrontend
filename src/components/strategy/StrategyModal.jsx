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
import {exchanges} from "../common/exchanges";
import {DynamicTextBox} from "../common/DynamicTextBox";

export const StrategyModal = ({isOpen, onRequestClose}) => {
    const timeUnits = ["Seconds", "Minutes", "Hours", "Days", "Weeks", "Months", "Years"];
    let refinements = {
        stopLoss: "",
        maxPosition: "",
        targetProfit: "",
        movingStopLoss: "",
        maxLoss: ""
    }

    const [strategy, setStrategy] = useState({
        name: "",
        type: "long",
        exchange: "",
        entry: "",
        targetPrice: "",
        timeFrame: "",
        timeUnit: "",
        base: "",
        quote: "",
        ...refinements
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
            type: body.type,
            exchange: body.exchange,
            entry: body.entry,
            targetPrice: body.targetPrice,
            timeFrame: body.timeFrame,
            timeUnit: body.timeUnit,
            base: body.base,
            quote: body.quote,
            ...getRefinements(body),
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
            return Object.keys(exchanges)
                .map(key => key.toLowerCase())
                .includes(exchange.trim().toLowerCase());
        } else {
            return false;
        }
    }

    const checkExchange = () => {
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

            <div className="strategyRequiredBox">
                <label htmlFor="strategyExchangeInput">Exchange</label>
                <input id="strategyExchangeInput" value={strategy.exchange}
                       onChange={e => setStrategy({...strategy, exchange: e.target.value})}/>
                <output id="exchangeResponse" data-testid="exchangeResponse"
                        data-issuccess={isValidExchange(strategy.exchange)}>
                    {checkExchange()}
                </output>

                <CryptoSelection
                    exchange={strategy.exchange}
                    updateAssets={handleAssetUpdate}
                    loadedAssets={{base: strategy.base, quote: strategy.quote}}/>

                <select id="strategyTypeSelect" onClick={event => setStrategy({...strategy, type: event.target.value})}>
                    <option value="" disabled selected>Strategy Type</option>
                    <option value="long">Long</option>
                    <option value="short">Short</option>
                </select>

                <label htmlFor="entryInput">Entry %</label>
                <DynamicTextBox id="entryInput" overwrite={strategy.entry}
                                options={{type: "number", disabled: strategy.targetPrice !== ""}}
                                onTyping={res => setStrategy({...strategy, entry: res.entry})}/>

                <div className="orDivider">Or</div>

                <label htmlFor="targetPriceInput">Target Price</label>
                <DynamicTextBox id="targetPriceInput" overwrite={strategy.targetPrice}
                                options={{type: "text", disabled: strategy.entry !== ""}}
                                onTyping={res => setStrategy({...strategy, targetPrice: res.entry})}/>


                <label htmlFor="strategyTimeFrameInput">Time Frame</label>
                <input type="number" min="0" id="strategyTimeFrameInput" value={strategy.timeFrame}
                       onChange={e => setStrategy({...strategy, timeFrame: e.target.value})}/>

                <select id="timeUnitSelect"
                        onClick={event => setStrategy({...strategy, timeUnit: event.target.value.toLowerCase()})}>
                    <option value="" disabled selected>Time Unit</option>
                    {timeUnits.map(unit => <option value={unit}>{unit}</option>)}

                </select>

            </div>

            <div className="strategyManagement">
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

            <button type="button" id="closeButton" onClick={() => onRequestClose()}>X</button>

            <RefineStrategy update={refineUpdate()} overwrite={getRefinements(strategy)}/>
        </Modal>
    )
};
