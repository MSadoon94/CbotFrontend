import React, {useEffect, useState} from "react";
import {DynamicTextBox} from "../common/DynamicTextBox";
import {apiRequest, headers} from "../api/apiRequest";
import {validation} from "../api/responseTemplates";

export const CryptoSelection = (props) => {
    const [baseEntry, setBaseEntry] = useState({isTyping: false, entry: ""});
    const [quoteEntry, setQuoteEntry] = useState({isTyping: false, entry: ""});
    const [validity, setValidity] = useState();

    useEffect(() => {
        if ((baseEntry.entry && quoteEntry.entry) !== "") {
            validateAssetPair();
        }
    }, [baseEntry, quoteEntry]);

    const validateAssetPair = async () => {
        await apiRequest(config, handler);
        setValidity(handler.output.message);
    };

    let config = {
        url: `/api/asset-pair/${baseEntry.entry + quoteEntry.entry}/kraken`,
        method: "get",
        headers: headers(props.jwt.token),
        username: props.username,
        jwt: props.jwt.token,
        expiration: props.jwt.expiration,
    };

    let handler = {
        output: null,
        templates: validation(`${baseEntry.entry}:${quoteEntry.entry}`),
        onSuccess: (res) => {
            handler.output = res
        },
        onFail: (res) => {
            handler.output = res
        }
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
                                        setBaseEntry(update)
                                    }}/>
                </div>
                <div>
                    <label htmlFor={"quoteInput"}>Quote Symbol</label>
                    <DynamicTextBox id={"quoteInput"}
                                    timeout={500}
                                    onTyping={(update) => {
                                        setQuoteEntry(update)
                                    }}/>
                </div>
                <output data-testid={"validity"} id={"validity"}
                        className={(validity === "✔" ? "checkmark" : "invalid")}>
                    {validity}
                </output>
            </form>
        </div>
    )

};