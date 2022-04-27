import {useContext, useEffect, useState} from "react";
import {Trade} from "../trade/Trade";
import {WebSocketContext} from "../../App";

export const TradeWidget = () => {
    const {wsMessages, wsClient} = useContext(WebSocketContext);
    const [trades, setTrades] = useState({});

    useEffect(() => {
        let initialTrades = wsMessages["/app/trades"];
        if (initialTrades) {
            setTrades(Object.values(initialTrades));
        }
    }, [wsMessages["/app/trades"]])

    useEffect(() => {
        let createdTrade = wsMessages["/topic/trades"];
        if (createdTrade) {
            setTrades(Object.values(createdTrade))
        }

    }, [wsMessages["/topic/trades"]]);

    return (
        <div className="tradeWidget">

            {Object.values(trades).map(trade =>
                <Trade body={trade}/>)}
        </div>
    )
}