import React, {useEffect, useState} from "react";
import {StrategyModal} from "../strategy/StrategyModal";
import ReactModal from "react-modal";
import "./home.css"
import {CheckboxWidget} from "../widgets/CheckboxWidget";
import {PowerWidget} from "../widgets/PowerWidget";
import {useApi} from "../api/useApi";
import {logoutApiModule} from "./homeApiModule";
import {TradeWidget} from "../widgets/TradeWidget";
import {SideBar} from "../side_bar/SideBar";

ReactModal.setAppElement(document.createElement('div'));

export const Home = () => {
    const [isStale, setStale] = useState(false);
    const [strategyModal, setStrategyModal] = useState({isOpen: false});
    const [sendLogoutRequest, , , setSession] = useApi();

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

    const logoutUser = async () => {
        await sendLogoutRequest(logoutApiModule())
            .finally(() => {
                window.alert("Logout was successful. Redirecting to start page.");
                localStorage.setItem("session", JSON.stringify({isExpired: false, isLoggedIn: false}));
                setSession({isExpired: false, isLoggedIn: false});
            })
    };

    return (
        <div className={"homePage"}>
            <SideBar/>
            <h1 className={"title"}>User Home</h1>

            <StrategyModal isOpen={strategyModal.isOpen}
                           onRequestClose={() => setStrategyModal({...strategyModal, isOpen: false})}
            />

            <div className={"newItemButtons"}>

                <button type={"button"} id={"newStrategyButton"} className={"homeButton"} onClick={() =>
                    setStrategyModal({...strategyModal, isOpen: true})}>New Strategy
                </button>

            </div>

            <div id={"strategyDetailsBox"}>
                <details id={"strategyDetails"} onToggle={() => setStale(true)}>
                    <summary>Strategies</summary>
                    <CheckboxWidget type="strategies"
                                    websocket={{
                                        initial: "/app/strategies/details",
                                        topic: "/topic/strategies/details",
                                        sendTo: "/app/create-trade"
                                    }}
                                    fields={{option: "name", isChecked: "isActive"}}
                    />
                </details>
            </div>

            <PowerWidget/>

            <button
                type={"button"} id={"logoutButton"} className={"homeButton"} onClick={logoutUser}>
                Log Out
            </button>

            <TradeWidget/>

        </div>
    )
};