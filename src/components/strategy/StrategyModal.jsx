import React from "react";
import Modal from "react-modal";
import {CryptoSelection} from "./CryptoSelection";

export const StrategyModal = (props) => {

    return (
        <Modal id={props.id} isOpen={props.isOpen}
               appElement={document.getElementById('app')}>
            <h2>Strategy Creator</h2>
            <CryptoSelection/>
        </Modal>
    )
};