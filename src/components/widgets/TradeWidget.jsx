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

        if (wsMessages["/topic/strategies/names"]) {
            wsMessages["/topic/strategies/names"].forEach(name => {
                if (wsMessages[`/topic/${name}/true`]) {
                    wsClient.current.sendMessage(`/app/${name}/create-trade`);
                    tradesReceived[wsMessages[`/topic/${name}/create-trade`].id]
                        = wsMessages[`/topic/${name}/create-trade`];
                }
            })
        }
        setTrades({...trades, ...tradesReceived})

    }, [wsMessages]);

    return (
        <div className="tradeWidget">

            {Object.values(trades).map(trade =>
                <Trade body={trade}/>)
            }
        </div>
    )
}