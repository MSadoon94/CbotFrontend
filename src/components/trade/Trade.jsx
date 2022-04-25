import {useContext, useEffect, useState} from "react";
import {WebSocketContext} from "../../App";

export const Trade = ({body}) => {
    const {wsMessages, wsClient} = useContext(WebSocketContext);
    const [realtime, setRealtime] = useState({price: null})
    const [trade, setTrade] = useState({...body});

    useEffect(() => {
        setTrade({...trade, ...body})
    }, [body])

    useEffect(() => {
        if (trade.id) {
            setRealtimeData();
        }
    }, [wsMessages]);

    const setRealtimeData = () => {
        let pair = body.pair.trim().replace("/", "");
        let currentPrice = `/topic/price/${trade.exchange.toLowerCase()}/${pair.toLowerCase()}`;
        if (wsMessages[currentPrice]) {
            setRealtime({...realtime, price: wsMessages[currentPrice]});
        }
    };

    return (
        <details key={trade.id} className="tradeDetails">
            <summary>{trade.label ? trade.label : trade.strategyName}</summary>
            <table>
                <tbody>
                <tr>
                    <th>Status</th>
                    <td>{trade.status}</td>
                </tr>
                <tr>
                    <th>Current Price</th>
                    <td>{realtime.price || trade.price}</td>
                </tr>
                </tbody>
            </table>
        </details>
    )
}