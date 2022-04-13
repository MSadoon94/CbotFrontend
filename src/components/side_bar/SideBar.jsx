import "./sideBar.css"
import {CredentialManager} from "./CredentialManager";
import {useState} from "react";

export const SideBar = () => {
    const [sideBarState, setSideBarState] = useState({isOpen: false, buttonText: "⮞"});

    return (
        <div className="outerSideBar" data-is_side_bar_open={sideBarState.isOpen}>
        <div className="innerSideBar" data-is_side_bar_open={sideBarState.isOpen}>
            <CredentialManager/>

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