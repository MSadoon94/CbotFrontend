import React, {useEffect, useState} from "react";

export const DynamicTextBox = (props) => {

    const [isTyping, setIsTyping] = useState(false);
    const [entry, setEntry] = useState("");

    useEffect(() => {
        if (isTyping) {
            textBoxTimeout();
        } else {
            props.onTyping({isTyping: false, entry});
        }
        return () => {
            clearTimeout(textBoxTimeout);
        }
    }, [isTyping]);

    const textBoxTimeout = () => {
        setTimeout(() => {
            setIsTyping(false);
            props.onTyping({isTyping: false, entry});
        }, props.timeout)
    };

    return (
        <input id={props.id} type={"text"} value={entry}
               onChange={e => {
                   if (entry !== e.target.value) {
                       setIsTyping(true);
                       setEntry(e.target.value)
                   }
               }}/>
    )

};