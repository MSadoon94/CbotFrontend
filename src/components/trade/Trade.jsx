import {useContext, useEffect, useState} from "react";
import {WebSocketContext} from "../../App";

export const Trade = ({body}) => {
    const {wsMessages, wsClient} = useContext(WebSocketContext);
    const [realtime, setRealtime] = useState({price: null})
    const [trade, setTrade] = useState({...body});
    let name = trade.strategyName;

    useEffect(() => {
        if (trade.id) {
            tradeUpdates();
            realtimePrice();
        }
    }, [wsMessages]);

    const realtimePrice = () => {
        let pair = body.pair.trim().replace("/", "");
        let currentPrice = `/topic/price/${trade.exchange.toLowerCase()}/${pair.toLowerCase()}`;
        if (wsMessages[currentPrice]) {
            setRealtime({...realtime, price: wsMessages[currentPrice]});
        }
    };

    const tradeUpdates = () => {
        let update = `/topic/trade/${trade.id}/update`;
        if (wsMessages[update]) {
            setTrade(wsMessages[update]);
        }
    }

    return (
        <details id={name.concat("TradeDetails")} className="tradeDetails">
            <summary>{name}</summary>
            <table>
                <tbody>
                <tr>
                    <th>Status</th>
                    <td id={name.concat("TradeStatus")}>{trade.status}</td>
                </tr>
                <tr>
                    <th>Current Price</th>
                    <td id={name.concat("TradeCurrent")}>{realtime.price || trade.price}</td>
                </tr>
                <tr>
                    <th>Target Price</th>
                    <td id={name.concat("TradeTarget")}>{trade.targetPrice || "Calculating..."}</td>
                </tr>
                </tbody>
            </table>
        </details>
    )
}