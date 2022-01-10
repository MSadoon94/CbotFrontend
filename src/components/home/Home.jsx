import React, {useEffect, useRef, useState} from "react";
import {StrategyModal} from "../strategy/StrategyModal";
import ReactModal from "react-modal";
import {apiConfig} from "../api/apiUtil";
import {change} from "../api/responseTemplates";
import {ApiResponse} from "../api/ApiResponse";
import {CardLoader} from "../card/CardLoader";
import {CardSaver} from "../card/CardSaver";
import "./home.css"
import {useHistory} from "react-router-dom";
import {CheckboxWidget} from "../widgets/CheckboxWidget";
import {loadStrategiesModule} from "../strategy/strategyApiModule";

ReactModal.setAppElement(document.createElement('div'));

export const Home = () => {
    const history = useHistory();
    const [isStale, setStale] = useState(false);
    const hasCardUpdate = useRef(false);
    const [newCardForm, setNewCardForm] = useState({isHidden: true});
    const [strategyModal, setStrategyModal] = useState({isOpen: false});
    const [request, setRequest] = useState();
    const [powerButton, setPowerButton] = useState({isActive: false})

    const logoutConfig = apiConfig({url: "/api/log-out", method: "delete"}, null);

    useEffect(() => {
        const staleTimer = setTimeout(() => {
            setStale(true);
        }, 30000)
        return () => {
            clearTimeout(staleTimer)
            setStale(false);
        }
    })

    const logoutUser = () => {
        let actions = {
            idAction: {
                type: "logout",
                execute: (response) => {
                    window.alert(`${response.message} Redirecting to start page.`)
                    history.push("/start");
                }
            }
        };
        setRequest({config: logoutConfig, templates: change("Logout"), actions});
    };

    const togglePower = () => setPowerButton({...setPowerButton, isActive: !powerButton.isActive})

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

            <div>
            <details id={"strategyActDetails"} onToggle={() => setStale(true)}>
                <summary>Strategies</summary>
                <CheckboxWidget type={"strategies"}
                                apiModule={loadStrategiesModule}
                                isStale={() => {
                                    console.log(isStale);
                                    return isStale
                                }}
                />
            </details>
            </div>


            <StrategyModal isOpen={strategyModal.isOpen}
                           onRequestClose={() => setStrategyModal({...strategyModal, isOpen: false})}
            />
            <CardLoader hasUpdate={hasCardUpdate.current}/>

            <div className={"leftHomeSideBar"}>

                <button type={"button"} id={"newCardButton"} className={"homeButton"} onClick={() =>
                    setNewCardForm({...newCardForm, isHidden: false})}>New Card
                </button>

                <button type={"button"} id={"newStrategyButton"} className={"homeButton"} onClick={() =>
                    setStrategyModal({...strategyModal, isOpen: true})}>New Strategy
                </button>

                <button
                    type={"button"} id={"logoutButton"} className={"homeButton"} onClick={logoutUser}>
                    Log Out
                </button>

                <button type={"button"}
                        id={"cbotPowerButton"}
                        className={powerButton.isActive ? "powerButtonOn" : "powerButtonOff"}
                        onClick={togglePower}>{}</button>

            </div>
        </div>
    )
};