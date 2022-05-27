import {useContext, useEffect, useState} from "react";
import {Trade} from "../trade/Trade";
import {WebSocketContext} from "../../App";
import {TradeMetrics} from "../trade/TradeMetrics";

export const TradeWidget = () => {
    const {wsMessages, wsClient} = useContext(WebSocketContext);
    const [trades, setTrades] = useState({});
    const [selected, setSelected] = useState({});


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

    const onTradeClick = (trade) => {
        if (selected === trade.strategyName) {
            setSelected({});
        } else {
            setSelected(trade.strategyName)
        }
    }

    return (
        <div className="tradeWidget">

            <div id="tradeScroller">
                {Object.values(trades).map(trade => {
                        return <div key={trade.strategyName.concat("Box")}
                                    onClick={() => onTradeClick(trade)}
                        >
                            <Trade body={trade}/>
                        </div>
                    }
                )}
            </div>

            <div id="tradeMetricDisplay">
                {Object.values(trades).map(trade =>
                    <TradeMetrics trade={trade} hidden={selected !== trade.strategyName}/>)}
            </div>
        </div>
    )
}