import React, {useRef, useState} from "react";
import {StrategyModal} from "../strategy/StrategyModal";
import ReactModal from "react-modal";
import {apiConfig} from "../api/apiUtil";
import {change} from "../api/responseTemplates";
import {ApiResponse} from "../api/ApiResponse";
import {CardLoader} from "../card/CardLoader";
import {CardSaver} from "../card/CardSaver";

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
        <div>
            <h1 className={"title"}>User Home</h1>

            <CardLoader hasUpdate={hasCardUpdate.current}/>

            <div hidden={newCardForm.isHidden}>
                <CardSaver/>
                <button type={"button"} id={"cancelCardButton"} onClick={() =>
                    setNewCardForm({...newCardForm, isHidden: true})}>Cancel Card
                </button>
            </div>

            <button type={"button"} id={"newCardButton"} onClick={() =>
                setNewCardForm({...newCardForm, isHidden: false})}>New Card
            </button>

            <ApiResponse cssId={"logout"} request={request}/>
            <button
                type={"button"} id={"logoutButton"} onClick={logoutUser}>
                Log Out
            </button>

            <button type={"button"} id={"newStrategyButton"} onClick={() =>
                setStrategyModal(true)}>New Strategy
            </button>

            <StrategyModal isOpen={strategyModal} onRequestClose={() => {
                setStrategyModal(false)
            }}
            />
        </div>
    )
};