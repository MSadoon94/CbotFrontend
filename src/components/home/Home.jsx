import React, {useEffect, useRef, useState} from "react";
import {StrategyModal} from "../strategy/StrategyModal";
import ReactModal from "react-modal";
import {apiConfig} from "../api/apiUtil";
import {change} from "../api/responseTemplates";
import {ApiResponse} from "../api/ApiResponse";
import {CardLoader} from "../card/CardLoader";
import {CardSaver} from "../card/CardSaver";
import "./home.css"

ReactModal.setAppElement(document.createElement('div'));

export const Home = () => {
    const hasCardUpdate = useRef(false);
    const [newCardForm, setNewCardForm] = useState({isHidden: true});
    const [strategyModal, setStrategyModal] = useState(false);
    const [request, setRequest] = useState();

    const logoutConfig = apiConfig({url: "/api/log-out", method: "delete"}, null);

    const logoutUser = () => {
        let actions = {
            idAction: {
                type: "logout",
                execute: (response) => {
                    window.alert(`${response.message} Redirecting to start page.`)
                }
            }
        };
        setRequest({config: logoutConfig, templates: change("Logout"), actions});
    };

    return (
        <div className={"homePage"}>
            <h1 className={"title"}>User Home</h1>

            <div hidden={newCardForm.isHidden} className={"cardForm"}>
                <CardSaver />
                <button type={"button"} id={"closeCardButton"} onClick={() =>
                    setNewCardForm({...newCardForm, isHidden: true})}>Close Card
                </button>
            </div>

            <ApiResponse cssId={"logout"} request={request}/>

            <StrategyModal isOpen={strategyModal} onRequestClose={() => {
                setStrategyModal(false)
            }}
            />
            <CardLoader hasUpdate={hasCardUpdate.current}/>

            <div className={"leftHomeSideBar"}>

                <button type={"button"} id={"newCardButton"} className={"homeButton"} onClick={() =>
                    setNewCardForm({...newCardForm, isHidden: false})}>New Card
                </button>

                <button type={"button"} id={"newStrategyButton"} className={"homeButton"} onClick={() =>
                    setStrategyModal(true)}>New Strategy
                </button>

                <button
                    type={"button"} id={"logoutButton"} className={"homeButton"} onClick={logoutUser}>
                    Log Out
                </button>

            </div>
        </div>
    )
};