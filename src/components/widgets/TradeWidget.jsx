import {useContext, useEffect, useState} from "react";
import {Trade} from "../trade/Trade";
import {WebSocketContext} from "../../App";

export const TradeWidget = () => {
    const {wsMessages, wsClient} = useContext(WebSocketContext);
    const [trades, setTrades] = useState({});

    useEffect(() => {
        let trade = wsMessages["/topic/trades"];
        let tradesReceived = {}
        if ((trade) && (!trades[trade.id])) {
            tradesReceived[trade.id] = trade;
        }

        if (wsMessages["/topic/create-trade"]) {
            tradesReceived[wsMessages["/topic/create-trade"].strategyName]
                = wsMessages["/topic/create-trade"];
        }

        setTrades({...trades, ...tradesReceived})

    }, [wsMessages["/topic/trades"], wsMessages["/topic/create-trade"]]);

    useEffect(() => {
        if (wsMessages["/topic/strategies/details"]) {
            wsMessages["/topic/strategies/details"].forEach(strategy => {
                if (strategy.isActive && !Object.keys(trades).includes(strategy.name)) {
                    setTrades({...trades, [strategy.name]: {strategyName: strategy.name}})
                    wsClient.current.sendMessage("/app/create-trade", strategy.name)
                }
            })
        }

    }, [wsMessages["/topic/strategies/details"]])

    return (
        <div className="tradeWidget">

            {Object.values(trades).map(trade =>
                <Trade body={trade}/>)
            }
        </div>
    )
}