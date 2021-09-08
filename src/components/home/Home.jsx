import React, {useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {KrakenCard} from "../card/KrakenCard";
import {customReqInterceptor} from "../common_api/requestInterceptors";
import {logout} from "../user/UserApi";
import {StrategyModal} from "../strategy/StrategyModal";
import ReactModal from "react-modal";

ReactModal.setAppElement(document.createElement('div'));

export const Home = () => {
    const location = useLocation();
    const history = useHistory();
    const [user, setUser] = useState(location.state);
    const [brokerageForm, setBrokerageForm] = useState(null);
    const [strategyModal, setStrategyModal] = useState(false);
    useEffect(() => {
        setUser(location.state);
    }, [location]);

    useEffect(() => {
        if (location.state.jwt === undefined) {
            history.push("/start")
        }
    }, []);


    const options = [
        {
            type: "-- Select a Brokerage --",
            form: null
        },
        {
            type: "Kraken",
            form: <KrakenCard user={user}/>
        }

    ];

    const getOption = (selected) => {
        return options.find(option => option.type === selected).form
    };

    const logoutUser = async () => {
        let outcome;
        await logout(user, customReqInterceptor, (res) => outcome = JSON.parse(res));
        window.alert(outcome.message + " Redirecting to start page.");
        history.push("/start");
    };

    return (
        <div>
            <h1 className={"title"}>User Home</h1>
            <form>
                <label htmlFor={"brokerageSelect"}>Add Brokerage</label>
                <select
                    id={"brokerageSelect"}
                    name={"brokerageSelect"}
                    onChange={e => {
                        setBrokerageForm(getOption(e.target.value));
                    }}>
                    {options.map((op) => (
                        <option key={op.type} value={op.type}>{op.type}</option>
                    ))}
                </select>
            </form>
            {brokerageForm}
            <button
                type={"button"} id={"logoutButton"} onClick={logoutUser}>
                Log Out
            </button>
            <button type={"button"} id={"newStrategyButton"} onClick={() => setStrategyModal(true)}>New Strategy
            </button>
            <StrategyModal isOpen={strategyModal} username={user.username}
                           jwt={{token: user.jwt, expiration: user.expiration}}
                           onRequestClose={() => {
                               setStrategyModal(false)
                           }}
            />
        </div>
    )
};