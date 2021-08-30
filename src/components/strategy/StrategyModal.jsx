import React from "react";
import Modal from "react-modal";
import {CryptoSelection} from "./CryptoSelection";

export const StrategyModal = (props) => {

    return (
        <Modal isOpen={props.isOpen}
               appElement={document.getElementById('app')}>
            <h2>Modal Title</h2>
            <p>Modal Body</p>
            <CryptoSelection/>
        </Modal>
    )
};