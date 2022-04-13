import React, {useRef, useState} from "react";
import "./widgets.css";
import {SOCKET_URI} from "../../App";
import SockJsClient from "react-stomp"

export const PowerWidget = () => {
    const powerButtonStates = {true: "active", false: "inactive"}
    const [status, setStatus] = useState({isActive: "", strategies: {}})
    const ws = useRef();

    const togglePower = () => {
        ws.current.sendMessage(
            "/app/cbot-status",
            JSON.stringify({isActive: !status.isActive, activeStrategies: status.strategies})
        )
        ws.current.sendMessage(
            "/app/ticker"
        )
    }

    let onMessageReceived = (message) => {
        setStatus({isActive: message.isActive, strategies: message.activeStrategies});
    }

    return (
        <div className={"statusWidget"}>

            <button type={"button"}
                    id={"cbotPowerButton"}
                    data-power-status={powerButtonStates[status.isActive]}
                    onClick={togglePower}>
            </button>

            <div>
                <SockJsClient
                    url={SOCKET_URI}
                    topics={["/app/cbot-status", "/topic/cbot-status", "/topic/ticker", "/app/ticker"]}
                    onMessage={msg => onMessageReceived(msg)}
                    ref={client => ws.current = client}
                />
            </div>

        </div>
    )
}