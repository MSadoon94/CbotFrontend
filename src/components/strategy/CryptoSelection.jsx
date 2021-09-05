import React, {useEffect, useState} from "react";
import {DynamicTextBox} from "../common/DynamicTextBox";
import {apiRequest, headers} from "../api/apiRequest";
import {validation} from "../api/responseTemplates";

export const CryptoSelection = (props) => {
    const [baseEntry, setBaseEntry] = useState();
    const [quoteEntry, setQuoteEntry] = useState();
    const [validity, setValidity] = useState();

    useEffect(() => {
        validateAssetPair();
    }, [baseEntry, quoteEntry]);

    const validateAssetPair = async () => {
        await apiRequest(config, handler);
        setValidity(handler.output.message);
    };

    let config = {
        url: "/api/asset-pair",
        method: "post",
        headers: headers(props.jwt.token),
        jwt: props.jwt.token,
        expiration: props.jwt.expiration,
        data: {username: props.username, selection: `${baseEntry}:${quoteEntry}`},
        transformRequest: [
            (data) => {
                delete data.username;
                return data;
            }]
    };

    let handler = {
        output: null,
        templates: validation(`${baseEntry}:${quoteEntry}`),
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
                                    timeout={2500}
                                    onTyping={(update) => {
                                        setBaseEntry(update)
                                    }}/>
                </div>
                <div>
                    <label htmlFor={"quoteInput"}>Quote Symbol</label>
                    <DynamicTextBox id={"quoteInput"}
                                    timeout={2500}
                                    onTyping={(update) => {
                                        setQuoteEntry(update)
                                    }}/>
                </div>
                <output data-testid={"validity"}>{validity}</output>
            </form>
        </div>
    )

};