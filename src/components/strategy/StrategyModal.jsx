import React from "react";
import Modal from "react-modal";
import {CryptoSelection} from "./CryptoSelection";
import "./modal.css"

export const StrategyModal = (props) => {

    return (
        <Modal id={"strategyModal"} isOpen={props.isOpen} jwt={props.jwt}
               onRequestClose={() => {
                   props.onRequestClose()
               }}
               appElement={document.getElementById('app')}
               className={"modal"} overlayClassName={"overlay"}
        >
            <h2>Strategy Creator</h2>
            <CryptoSelection jwt={props.jwt}/>
            <button type={"button"} id={"closeButton"} onClick={() => {props.onRequestClose()}}>X</button>
        </Modal>
    )
};