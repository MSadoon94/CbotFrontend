import React, {useEffect, useState} from "react";

export const DynamicTextBox = (props) => {

    const [isTyping, setIsTyping] = useState(false);
    const [entry, setEntry] = useState();

    useEffect(() => {
        if (isTyping) {
            const textBoxTimeout =
                setTimeout(setIsTyping(false), 500);
            return () => {
                clearTimeout(textBoxTimeout);
                props.onTyping({isTyping: true, entry});
            }
        }
    }, [isTyping, props]);

    return (
        <input id={props.id} type={"text"} value={entry}
               onChange={e => {
                   setIsTyping(true);
                   setEntry(e.target.value)
               }}/>
    )

};