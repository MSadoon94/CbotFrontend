import React, {useEffect, useState} from "react";
import {DynamicTextBox} from "../common/DynamicTextBox";
import {getAssetPair, strategyIds} from "./strategyApiModule";
import {useApi} from "../api/useApi";

export const CryptoSelection = ({updateAssets, loadedAssets}) => {
    const [base, setBase] = useState({isTyping: false, entry: ""});
    const [quote, setQuote] = useState({isTyping: false, entry: ""});
    const [sendAssetPairRequest, response,] = useApi();

    useEffect(() => {
        if ((base.entry && quote.entry) !== "") {
            validateAssetPair();
        }
        updateAssets({base: base.entry, quote: quote.entry});
    }, [base, quote]);

    let assetPair = () => base.entry + quote.entry;

    const validateAssetPair = () => {
        sendAssetPairRequest(getAssetPair(assetPair()));
    };

    return (
        <div id={"cryptoSelection"}>
            <h3>Crypto Selection</h3>
            <div>
                <label htmlFor={"baseInput"}>Base Symbol</label>
                <DynamicTextBox id={"baseInput"}
                                timeout={500}
                                onTyping={(update) => {
                                    setBase(update)
                                }} overwrite={loadedAssets.base}/>
            </div>
            <div>
                <label htmlFor={"quoteInput"}>Quote Symbol</label>
                <DynamicTextBox id={"quoteInput"}
                                timeout={500}
                                onTyping={(update) => {
                                    setQuote(update);
                                }} overwrite={loadedAssets.quote}/>
            </div>
            <output id={strategyIds.getAssetPairData} data-testid={strategyIds.getAssetPairData}
                    data-isSuccess={strategyIds.getAssetPairData}>{response.message}</output>
        </div>
    )

};