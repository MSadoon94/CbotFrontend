import React, {useEffect, useState} from "react";
import {DynamicTextBox} from "../common/DynamicTextBox";

export const CryptoSelection = () => {
    const [baseEntry, setBaseEntry] = useState();
    const [quoteEntry, setQuoteEntry] = useState();

    return(
        <div>
            <h3>Crypto Selection</h3>
            <form>
                <div>
                    <label htmlFor={"baseInput"}>Base Symbol</label>
                    <DynamicTextBox id={"baseInput"}
                                    timeout={1000}
                                    onTyping={(update) => {
                                        setBaseEntry(update)
                                    }}/>
                </div>
                <div>
                    <label htmlFor={"quoteInput"}>Quote Symbol</label>
                    <DynamicTextBox id={"quoteInput"}
                                    timeout={1000}
                                    onTyping={(update) => {
                                        setQuoteEntry(update)
                                    }}/>
                </div>
            </form>
        </div>
    )

};