import React, {useEffect, useState} from "react";
import {addCard, getCard} from "./CardApi";
import {postReqInterceptor, refreshTokenInterceptor} from "../common_api/requestInterceptors";
import {refreshJwt} from "../common_api/RefreshTokenApi";
import "./card.css"

export const KrakenCard = (props) => {

    const [card, setCard] = useState(
        {
            account: "",
            username: props.user.username,
            password: "",
            jwt: props.user.jwt,
            expiration: props.user.expiration,
            balance: ""
        });
    const [isLoggedIn, setLogIn] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            getKrakenCard();
        }
    }, [isLoggedIn]);

    const addKraken = async () => {
        let response;

        await addCard(card, postReqInterceptor, (res) => response = JSON.parse(res));
        if (response.message === `${card.account} was created successfully.`) {
            setLogIn(true);
        } else if (response.message === "Jwt expired") {
            await refresh();
        } else {
            setLogIn(false)
        }
    };

    const refresh = async () => {
        let outcome;
        await refreshJwt(card, refreshTokenInterceptor, (res) => outcome = JSON.parse(res));
        if (outcome.message === "Successfully refreshed jwt token") {
            setCard({...card, jwt: outcome.body.jwt, expiration: outcome.body.expiration});
            setLogIn(true);
        } else {
            alert("Session has ended, logging out.");
            setLogIn(false);
        }
    };

    const getKrakenCard = async () => {
        let response;
        await getCard(card, props.user, (res) => response = JSON.parse(res));
        setCard({...card, balance: response.balance});
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
            {isLoggedIn
                ? displayCard()
                : cardForm()}
        </div>
    )
};