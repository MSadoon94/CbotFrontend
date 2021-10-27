import React, {useRef, useState} from "react";
import {KrakenCard} from "../card/KrakenCard";
import {StrategyModal} from "../strategy/StrategyModal";
import ReactModal from "react-modal";
import {apiConfig} from "../api/apiUtil";
import {change} from "../api/responseTemplates";
import {ApiResponse} from "../api/ApiResponse";
import {CardLoader} from "../card/CardLoader";

ReactModal.setAppElement(document.createElement('div'));

export const Home = () => {
    const hasCardUpdate = useRef(false);

    const [brokerageForm, setBrokerageForm] = useState(null);
    const [strategyModal, setStrategyModal] = useState(false);
    const [request, setRequest] = useState();

    const options = [
        {
            type: "-- Select a Brokerage --",
            form: null
        },
        {
            type: "Kraken",
            form: <KrakenCard/>
        }

    ];

    const getOption = (selected) => {
        hasCardUpdate.current = true;
        return options.find(option => option.type === selected).form
    };

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
            <ApiResponse cssId={"logout"} request={request}/>
            <button
                type={"button"} id={"logoutButton"} onClick={logoutUser}>
                Log Out
            </button>
            <button type={"button"} id={"newStrategyButton"} onClick={() => setStrategyModal(true)}>New Strategy
            </button>
            <StrategyModal isOpen={strategyModal} onRequestClose={() => {
                setStrategyModal(false)
            }}
            />
        </div>
    )
};