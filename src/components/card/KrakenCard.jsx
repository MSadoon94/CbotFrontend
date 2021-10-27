import React, {useEffect, useRef, useState} from "react";
import "./card.css"
import {create, load} from "../api/responseTemplates";
import {apiConfig} from "../api/apiUtil";
import {ApiResponse} from "../api/ApiResponse";
import {outputTypes} from "../common/outputTypes";

export const KrakenCard = () => {

    const [balanceRequest, setBalanceRequest] = useState();
    const [cardRequest, setCardRequest] = useState();
    const [isCardDisplayed, setIsCardDisplayed] = useState(false);
    const card = useRef({cardName:"Default", brokerage: "kraken"});

    const addCardConfig = () => {
        return apiConfig({url: "api/save-card", method: "post"}, card.current)
    };

    let balanceConfig = () => {
        return apiConfig({url: `api/home/card/${card.current.account}`, method: "get"}, null)
    };

    useEffect(() => {
        if (isCardDisplayed) {
            getBalance();
        }

    }, [isCardDisplayed]);

    const addCard = () => {
        let actions = {
            onComplete: {
                success: () => setIsCardDisplayed(true),
                fail: () => setIsCardDisplayed(false)
            }
        };
        setCardRequest({config: addCardConfig(), templates: create("Kraken Card"), actions});
    };

    const getBalance = () => {
        setBalanceRequest({config: balanceConfig(), templates: load("Kraken Card")});
    };

    const CardForm = () => {
        return (
            <form>
                <label htmlFor={"cardName"}>Card Name</label>
                <input type={"text"} id={"cardName"}
                       onChange={e => card.current = {...card.current, cardName: e.target.value}}/>
                <label htmlFor={"apiKey"}>API Key</label>
                <input type={"text"} id={"apiKey"}
                       onChange={e => card.current = {...card.current, account: e.target.value}}/>
                <label htmlFor={"privateKey"}>Private Key</label>
                <input type={"text"} id={"privateKey"}
                       onChange={e => card.current = {...card.current, password: e.target.value}}/>
                <button type={"button"} id={"addBrokerage"} onClick={addCard}>Add Kraken</button>
                <ApiResponse cssId={"addCard"} request={cardRequest}/>
            </form>)
    };

    const DisplayCard = () => {
        return (
            <form>
                <label htmlFor={"krakenBalance"} id={"balanceLabel"} >Current Balance </label>
                <ApiResponse cssId={"krakenBalance"} request={balanceRequest}
                             outputPath={outputTypes.krakenBalance}
                />
            </form>
        )
    };

    return (
        <div className={"card"}>
            {isCardDisplayed ? DisplayCard() : CardForm()}
        </div>
    )
};