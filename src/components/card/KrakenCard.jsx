import React, {useState} from "react";
import {addCard} from "./CardApi";

export function KrakenCard(props){
    const [card, setCard] = useState({account: "", password: "", outcome: ""});

    const addKraken = async () =>{
      let response;
      await addCard(card, props.jwt,(res) => response = JSON.parse(res));
      setCard({...card, outcome: response.message});
    };

    return (
        <div>
            <form>
                <label htmlFor={"apiKey"}>API Key</label>
                <input type={"text"} id={"apiKey"}
                       onChange={e => setCard({...card, account: e.target.value})}/>
                <label htmlFor={"privateKey"}>Private Key</label>
                <input type={"text"} id={"privateKey"}
                       onChange={e => setCard({...card, password: e.target.value})}/>
                <button id={"addBrokerage"} onClick={addKraken}>Add Kraken</button>
            </form>
        </div>
    )
}