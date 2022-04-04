import {useRef, useState} from "react";
import {Trade} from "../trade/Trade";
import SockJsClient  from "react-stomp";
import {SOCKET_URI} from "../../App";

export const TradeWidget = () => {
    const [trades, setTrades] = useState([]);
    const ws = useRef();

    const onMessageReceived = (message) => {
        setTrades([...trades, message]);
    }

    return (
        <div className="tradeWidget">
            <SockJsClient
                url={SOCKET_URI}
                topics={["/app/trade", "/topic/trade"]}
                onMessage={message => onMessageReceived(message)}
                ref={client => ws.current = client}
            />
            {trades.map(trade =>
                <Trade body={trade}/>)
            }
        </div>
    )
}