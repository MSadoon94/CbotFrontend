import {useRef, useState} from "react"
import {ApiResponse} from "../api/ApiResponse";
import {apiConfig} from "../api/apiUtil";
import {save} from "../api/responseTemplates";
import "./card.css";


export const CardSaver = () => {
    const card = useRef({cardName: "", account: "", password: "", brokerage: ""});
    const [saveRequest, setSaveRequest] = useState({});

    const saveCard = () => {
        let config = apiConfig({url: "api/user/card", method: "post"}, card.current);

        setSaveRequest({config, templates: save("Card")});
    };

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

            <button type={"button"} id={"saveCardButton"} onClick={() => saveCard()}>Save Card</button>
            <ApiResponse cssId={"saveCardResponse"} request={saveRequest}/>

        </div>
    )
};