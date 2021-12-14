import React, {useEffect, useState} from "react";
import {DynamicTextBox} from "../common/DynamicTextBox";
import {validation} from "../api/responseTemplates";
import {apiConfig} from "../api/apiUtil";
import {ApiResponse} from "../api/ApiResponse";

export const CryptoSelection = ({loadedAssets}) => {
    const [base, setBase] = useState({isTyping: false, entry: ""});
    const [quote, setQuote] = useState({isTyping: false, entry: ""});
    const [request, setRequest] = useState();

    useEffect(() => {
        if ((base.entry && quote.entry) !== "") {
            validateAssetPair();
        }
    }, [base, quote]);

    let assetPair = () => base.entry + quote.entry;

    let config = apiConfig({url: `/api/asset-pair/${assetPair()}/kraken`, method: "get"}, null);

    const validateAssetPair = () => {
        setRequest({config, templates: validation(assetPair())});
    };

    return (
        <div>
            <h3>Crypto Selection</h3>
            <form>
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
                <ApiResponse cssId={"selectCrypto"} request={request}/>
            </form>
        </div>
    )

};