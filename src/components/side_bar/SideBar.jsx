import "./sideBar.css"
import {CredentialManager} from "./CredentialManager";
import {useContext, useEffect, useState} from "react";
import {Exchange} from "./exchange/Exchange";
import {WebSocketContext} from "../../App";

export const SideBar = () => {
    const {wsMessages, wsClient} = useContext(WebSocketContext)
    const [sideBarState, setSideBarState] = useState({isOpen: false, buttonText: "⮞"});
    const [exchanges, setExchanges] = useState({});

    useEffect(() => {
        let message = wsMessages["/topic/balance"];
        if(message){
            let balances = Object.entries(message.balances).map(([currency, amount]) => [{currency, amount}]);
            setExchanges({...exchanges,
                [message.exchange]: {name: message.exchange, balances, isHidden: false}
            })
        }

    }, [wsMessages["/topic/balance"]])

    return (
        <div className="outerSideBar" data-is_side_bar_open={sideBarState.isOpen}>
        <div className="innerSideBar" data-is_side_bar_open={sideBarState.isOpen}>
            <CredentialManager/>
            {Object.values(exchanges).map((exchange) =>
                <Exchange initial={exchange}/>
            )}

        </div>
            <button type="button" id="sideBarButton"
                    onClick={() => {
                        setSideBarState({...sideBarState,
                            isOpen: !sideBarState.isOpen,
                            buttonText: sideBarState.isOpen ? "⮞" : "⮜"
                        });
                    }}>{sideBarState.buttonText}</button>
        </div>
    )
}