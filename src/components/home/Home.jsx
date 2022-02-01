import React, {useEffect, useRef, useState} from "react";
import {StrategyModal} from "../strategy/StrategyModal";
import ReactModal from "react-modal";
import {CardLoader} from "../card/CardLoader";
import {CardSaver} from "../card/CardSaver";
import "./home.css"
import {useHistory} from "react-router-dom";
import {CheckboxWidget} from "../widgets/CheckboxWidget";
import {loadStrategiesModule2} from "../strategy/strategyApiModule";
import {StatusWidget} from "../widgets/StatusWidget";
import {useApi} from "../api/useApi";
import {logoutApiModule} from "./homeApiModule";

ReactModal.setAppElement(document.createElement('div'));

export const Home = () => {
    const history = useHistory();
    const [isStale, setStale] = useState(false);
    const [newCardForm, setNewCardForm] = useState({isHidden: true});
    const [strategyModal, setStrategyModal] = useState({isOpen: false});
    const activeStrategiesRef = useRef([]);
    const [sendLogoutRequest, ,] = useApi();

    useEffect(() => {
        const staleTimer = setTimeout(() => {
            setStale(true);
        }, 30000)
        return () => {
            clearTimeout(staleTimer)
            if (isStale) {
                setStale(false);
            }
        }
    })

    const logoutUser = () => {
        sendLogoutRequest(logoutApiModule({
            idAction: {
                type: "logout",
                execute: (response) => {
                    window.alert(`${response.message} Redirecting to start page.`)
                    history.push("/start");
                }
            }
        }))
    };

    return (
        <div className={"homePage"}>
            <h1 className={"title"}>User Home</h1>

            <div hidden={newCardForm.isHidden} className={"cardForm"}>
                <CardSaver/>
                <button type={"button"} id={"closeCardButton"} onClick={() =>
                    setNewCardForm({...newCardForm, isHidden: true})}>Close Card
                </button>
            </div>

            <StrategyModal isOpen={strategyModal.isOpen}
                           onRequestClose={() => setStrategyModal({...strategyModal, isOpen: false})}
            />
            <CardLoader/>

            <div className={"newItemButtons"}>

                <button type={"button"} id={"newCardButton"} className={"homeButton"} onClick={() =>
                    setNewCardForm({...newCardForm, isHidden: false})}>New Card
                </button>

                <button type={"button"} id={"newStrategyButton"} className={"homeButton"} onClick={() =>
                    setStrategyModal({...strategyModal, isOpen: true})}>New Strategy
                </button>

            </div>


            <details id={"strategyActDetails"} onToggle={() => setStale(true)}>
                <summary>Strategies</summary>
                <CheckboxWidget type={"strategies"}
                                apiModule={loadStrategiesModule2()}
                                isStale={() => isStale}
                                onRequest={() => (
                                    {
                                        isReady: false,
                                        getRequest: (checked) =>
                                            activeStrategiesRef.current = checked
                                    }
                                )}
                />
            </details>

            <StatusWidget/>

            <button
                type={"button"} id={"logoutButton"} className={"homeButton"} onClick={logoutUser}>
                Log Out
            </button>

        </div>
    )
};