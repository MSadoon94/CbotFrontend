import {useRef, useState} from "react"
import {ApiResponse} from "../api/ApiResponse";
import {apiConfig} from "../api/apiUtil";
import {save} from "../api/responseTemplates";
import "./card.css";
import {useApi} from "../api/useApi";
import {cardIds, saveCardApiModule} from "./cardApiModule";


export const CardSaver = () => {
    const card = useRef({cardName: "", account: "", password: "", brokerage: ""});
    const [sendSaveRequest, saveResponse, ] = useApi();

    return (
        <div className={"cardSaver"}>
            <label htmlFor={"cardNameInput"}>Card Name</label>
            <input type={"text"} id={"cardNameInput"}
                   onChange={e => card.current = {...card.current, cardName: e.target.value}}/>

            <label htmlFor={"cardAccountInput"}>Account</label>
            <input type={"text"} id={"cardAccountInput"}
                   onChange={e => card.current = {...card.current, account: e.target.value}}/>

            <label htmlFor={"cardPasswordInput"}>Password</label>
            <input type={"text"} id={"cardPasswordInput"}
                   onChange={e => card.current = {...card.current, password: e.target.value}}/>

            <label htmlFor={"cardBrokerageInput"}>Brokerage</label>
            <input type={"text"} id={"cardBrokerageInput"}
                   onChange={e => card.current = {...card.current, brokerage: e.target.value.toLowerCase()}}/>

            <button type={"button"} id={"saveCardButton"}
                    onClick={() => sendSaveRequest(saveCardApiModule(card.current))}>Save Card</button>
            <output id={cardIds.saveCardResponse} data-testid={cardIds.saveCardResponse}
                    data-issuccess={saveResponse.isSuccess}>{saveResponse.message}</output>

        </div>
    )
};