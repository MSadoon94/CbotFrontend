import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {KrakenCard} from "../card/KrakenCard";

export function Home() {
    const location = useLocation();
    const [jwt, setJwt] = useState("");
    const [brokerageForm, setBrokerageForm] = useState(null);

    useEffect(() => {
        setJwt(location.state);
    }, [location]);

    const options = [
        {
            type: "-- Select a Brokerage --",
            form: null
        },
        {
            type: "Kraken",
            form: <KrakenCard  jwt={jwt}/>
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
                    onChange={e =>{
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