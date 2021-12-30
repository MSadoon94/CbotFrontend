import React, {useEffect, useState} from "react";
import {value} from "lodash/seq";

export const DynamicTextBox = ({onTyping, timeout = 500,
                                   id, overwrite, options = {type: "text"}}) => {
    const [overwriteState, setOverwriteState] = useState({isChanging: false, value: ""})
    const [isTyping, setIsTyping] = useState(false);
    const [entry, setEntry] = useState("");

    useEffect(() => {
        if(overwrite && overwrite !== "") {
            setOverwriteState({isChanging: false, value: overwrite})
        }
    }, [overwrite])

    useEffect(() => {
        if (isTyping) {
            textBoxTimeout();
        } else {
            onTyping({isTyping: false, entry});
        }
        return () => {
            clearTimeout(textBoxTimeout);
        }
    }, [isTyping]);

    const textBoxTimeout = () => {
        setTimeout(() => {
            setIsTyping(false);
            onTyping({isTyping: false, entry});
        }, timeout)
    };

    return (
        <>
        {(overwriteState.isChanging === false)
            ? <input id={id} type={options.type} min={0} value={overwriteState.value}
                     onClick={setOverwriteState({...overwriteState, isChanging: true})}/>
            : <input id={id} type={options.type} min={0} value={overwriteState.value}
               onChange={e => {
                   if (entry !== e.target.value) {
                       setIsTyping(true);
                       setEntry(e.target.value);
                       setOverwriteState({...overwriteState, value: e.target.value})
                   } else {
                       setOverwriteState({isChanging: false, value: e.target.value});
                   }
               }}/>
    }
        </>
    )

};