import React, {useEffect, useState} from "react";
import {DynamicTextBox} from "../common/DynamicTextBox";
import {apiRequest} from "../api/apiRequest";
import {validation} from "../api/responseTemplates";
import {apiConfig, apiHandler} from "../api/apiUtil";

export const CryptoSelection = (props) => {
    const [baseEntry, setBaseEntry] = useState({isTyping: false, entry: ""});
    const [quoteEntry, setQuoteEntry] = useState({isTyping: false, entry: ""});
    const [validity, setValidity] = useState();

    const [id, setId] = useState({
        jwt: props.jwt.token,
        expiration: props.jwt.expiration,
        username: props.username,
        isLoggedIn: false
    });

    useEffect(() => {
        if ((baseEntry.entry && quoteEntry.entry) !== "") {
            validateAssetPair();
        }
    }, [baseEntry, quoteEntry]);

    let assetPair = () => baseEntry.entry + quoteEntry.entry;

    let config = apiConfig({url: `/api/asset-pair/${assetPair()}/kraken`, method: "get"}, null, id);

    let handler = apiHandler(validation(assetPair()), (res) => setId(res));

    const validateAssetPair = async () => {
        await apiRequest(config, handler);
        setValidity(handler.output.message);
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