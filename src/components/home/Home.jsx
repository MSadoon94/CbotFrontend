import React, {useState} from "react";
import {StrategyModal} from "../strategy/StrategyModal";
import ReactModal from "react-modal";
import "./home.css"
import {OptionWidget} from "../widgets/OptionWidget";
import {PowerWidget} from "../widgets/PowerWidget";
import {useApi} from "../api/useApi";
import {logoutApiModule} from "./homeApiModule";
import {TradeWidget} from "../widgets/TradeWidget";
import {SideBar} from "../side_bar/SideBar";

ReactModal.setAppElement(document.createElement('div'));

export const Home = () => {
    const [topNavState, setTopNavState] = useState({strategyManager: false, strategies: true});
    const [sendLogoutRequest, , , setSession] = useApi();


    const logoutUser = async () => {
        await sendLogoutRequest(logoutApiModule())
            .finally(() => {
                window.alert("Logout was successful. Redirecting to start page.");
                localStorage.setItem("session", JSON.stringify({isExpired: false, isLoggedIn: false}));
                setSession({isExpired: false, isLoggedIn: false});
            })
    };

    return (

        <div id="homePage" className="homePage">
            <div className="topNav">
                <button id="strategyManagerButton" className="topNavButton"
                        onClick={() => setTopNavState({
                            ...topNavState,
                            strategyManager: !topNavState.strategyManager
                        })}>
                    Strategy Manager
                </button>
                <button id="strategiesButton" className="topNavButton"
                        onClick={() => setTopNavState({...topNavState, strategies: !topNavState.strategies})}
                >Strategies
                </button>
                <PowerWidget/>
                <div id="strategySliderList" hidden={topNavState.strategies}>
                    <OptionWidget category="strategies"
                                  format="range"
                                  websocket={{
                                      initial: "/app/strategies/details",
                                      topic: "/topic/strategies/details",
                                      sendTo: "/app/create-trade"
                                  }}
                                  fields={{option: "name", isChecked: "isActive"}}
                    />
                </div>
                <button id="logOutButton" className="topNavButton" onClick={logoutUser}>Log Out</button>
            </div>

            <SideBar/>

            <StrategyModal isOpen={topNavState.strategyManager}
                           onRequestClose={() => setTopNavState({...topNavState, strategyManager: false})}
            />

                <TradeWidget/>
        </div>
    )
};