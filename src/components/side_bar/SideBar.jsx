import "./sideBar.css"
import {CredentialManager} from "./CredentialManager";
import {useContext, useEffect, useState} from "react";
import {Card} from "../card/Card";
import {WebSocketContext} from "../../App";

export const SideBar = () => {
    const initialSelected = {hidePasswordBox: true, cardName: ""}
    const {wsMessages, wsClient} = useContext(WebSocketContext)
    const [sideBarState, setSideBarState] = useState({isOpen: false, buttonText: "⮞"});
    const [cardSelected, setCardSelected] = useState(initialSelected)
    const [displayedCards, setDisplayedCards] = useState({});

    useEffect(() => {
        let message = wsMessages["/topic/balance"];
        if(message){
            let balances = Object.entries(message.balances).map(([currency, amount]) => [{currency, amount}]);
            setDisplayedCards({...displayedCards,
                [message.exchange]: {name: message.exchange, balances, isHidden: false}
            })
            setCardSelected({...cardSelected, hidePasswordBox: true})
        }

    }, [wsMessages["/topic/balance"]])

    return (
        <div className="outerSideBar" data-is_side_bar_open={sideBarState.isOpen}>
        <div className="innerSideBar" data-is_side_bar_open={sideBarState.isOpen}>
            <CredentialManager/>
            {Object.values(displayedCards).map((card) =>
                <Card cardData={card}/>
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