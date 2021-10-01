import React, {useEffect, useState} from "react";

export const DynamicTextBox = ({onTyping, timeout, id}) => {

    const [isTyping, setIsTyping] = useState(false);
    const [entry, setEntry] = useState("");

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
        <input id={id} type={"text"} value={entry}
               onChange={e => {
                   if (entry !== e.target.value) {
                       setIsTyping(true);
                       setEntry(e.target.value)
                   }
               }}/>
    )

};