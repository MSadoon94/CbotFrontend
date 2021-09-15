import React, {useEffect, useState} from "react";
import "./card.css"
import {apiRequest} from "../api/apiRequest";
import {create} from "../api/responseTemplates";
import {apiConfig, apiHandler} from "../api/apiUtil";
import {HttpCodes} from "../common/httpCodes";

export const KrakenCard = (props) => {

    const [id, setId] = useState({
        jwt: props.user.jwt,
        expiration: props.user.expiration,
        username: props.user.username,
        isLoggedIn: false
    });
    const [card, setCard] = useState({
        account: "",
        password: "",
        balance: ""
    });

    useEffect(() => {
        console.log(id.isLoggedIn);
        if (id.isLoggedIn) {
            getKrakenCard();
        }
    }, [id.isLoggedIn]);

    let addCardConfig = apiConfig({url: "api/home/card", method: "post"}, card, id);

    let getCardConfig = apiConfig({url: `api/home/card/${card.account}`}, null, id);

    let handler = apiHandler(
        create("Kraken Card"),
        {
            onSuccess: (res) => setId({...id, jwt: res.jwt, expiration: res.expiration, isLoggedIn: true}),
            onFail: () => setId({...id, isLoggedIn: false})
        });

    const addKraken = async () => {
        await apiRequest(addCardConfig, handler);
        setId({...id, isLoggedIn: handler.output.status === HttpCodes.created});
    };

    const getKrakenCard = async () => {
        await apiRequest(getCardConfig, handler);
        setCard({...card, balance: handler.output});
        console.log(card.balance);
    };

    const cardForm = () => {
        return (
            <form>
                <label htmlFor={"apiKey"}>API Key</label>
                <input type={"text"} id={"apiKey"}
                       onChange={e => setCard({...card, account: e.target.value})}/>
                <label htmlFor={"privateKey"}>Private Key</label>
                <input type={"text"} id={"privateKey"}
                       onChange={e => setCard({...card, password: e.target.value})}/>
                <button type={"button"} id={"addBrokerage"} onClick={addKraken}>Add Kraken</button>
            </form>)
    };

    const displayCard = () => {
        return (
            <form>
                <label htmlFor={"balance"}>Current Balance</label>
                <input type={"text"} id={"balance"} value={card.balance} readOnly/>
            </form>
        )
    };

    return (
        <div className={"card"}>
            {id.isLoggedIn
                ? displayCard()
                : cardForm()}
        </div>
    )
};