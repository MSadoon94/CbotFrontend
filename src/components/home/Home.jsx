import React, {useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {KrakenCard} from "../card/KrakenCard";

export function Home() {
    const location = useLocation();
    const history = useHistory();
    const [user, setUser] = useState(location.state);
    const [brokerageForm, setBrokerageForm] = useState(null);

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

    function getOption(selected) {
        return options.find(option => option.type === selected).form
    }

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
        </div>
    )
}