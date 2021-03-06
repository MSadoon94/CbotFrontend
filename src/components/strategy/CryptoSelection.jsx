import React, {Fragment, useContext, useEffect, useState} from "react";
import {DynamicTextBox} from "../common/DynamicTextBox";
import {strategyIds} from "./strategyApiModule";
import {WebSocketContext} from "../../App";
import {validation} from "../api/responseTemplates";

export const CryptoSelection = ({exchange, updateAssets, loadedAssets}) => {
    const {wsMessages, wsClient} = useContext(WebSocketContext);
    const [exchangeStatus, setExchangeStatus]
        = useState({isExchangeValid: true, response: ""})
    const [base, setBase] = useState({isTyping: false, entry: ""});
    const [quote, setQuote] = useState({isTyping: false, entry: ""});
    const [pairResponse, setPairResponse] = useState({isSuccess: false, message: ""});

    useEffect(() => {
        if ((base.entry && quote.entry) !== "") {
            validateAssetPair();
        }
        updateAssets({base: base.entry, quote: quote.entry});
    }, [base, quote]);

    useEffect(() => {
        if (wsMessages["/topic/asset-pairs"]) {
            let pairs = wsMessages["/topic/asset-pairs"];
            if ((pairs.error) && pairs.error.length === 0) {
                setPairResponse({
                    isSuccess: true,
                    message: validation(base.entry.concat(quote.entry)).success
                });
            } else {
                setPairResponse({
                    isSuccess: false,
                    message: validation(base.entry.concat(quote.entry)).fail
                });
            }
        }
    }, [wsMessages["/topic/asset-pairs"]])

    const validateAssetPair = () => {
        if (exchange) {
            setExchangeStatus({isExchangeValid: true, response: ""})
            wsClient.current.sendMessage(
                "/app/asset-pairs",
                JSON.stringify({exchange: exchange, assets: `${base.entry}/${quote.entry}`})
            );
        } else {
            setExchangeStatus({isExchangeValid: false, response: "Exchange is not valid."})
        }
    };

    return (
        <Fragment id="cryptoSelection">

            <label htmlFor={"baseInput"} className="cryptoSelectionLabel">Base Symbol</label>
            <DynamicTextBox id={"baseInput"} className="cryptoSelectionInput"
                            timeout={500}
                            onTyping={(update) => {
                                setBase(update)
                            }} overwrite={loadedAssets.base}/>


            <label htmlFor={"quoteInput"} className="cryptoSelectionLabel">Quote Symbol</label>
            <DynamicTextBox id={"quoteInput"} className="cryptoSelectionInput"
                            timeout={500}
                            onTyping={(update) => {
                                setQuote(update);
                            }} overwrite={loadedAssets.quote}/>

            <output id={strategyIds.getAssetPairData} data-testid={strategyIds.getAssetPairData}
                    data-issuccess={pairResponse.isSuccess}>{pairResponse.message}</output>
            <output id="exchangeStatus" data-testid="exchangeStatus"
                    data-issuccess={exchangeStatus.isExchangeValid}>{exchangeStatus.response}</output>
        </Fragment>
    )

};