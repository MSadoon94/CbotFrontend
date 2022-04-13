import {Fragment, useContext, useEffect, useState} from "react";
import {WebSocketContext} from "../../App";

export const CheckboxWidget = ({
                                   type,
                                   websocket = null
                               }) => {
    const {wsMessages, wsClient} = useContext(WebSocketContext);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        let messages = websocket.topic
            .flatMap(topic => wsMessages[topic].payload)
            .filter(Boolean);

        if (messages !== []) {
            setOptions(messages);
        }
    }, [wsMessages]);

    return (
        <div id={`${type}checkboxWidget`}>
            {options.map(option => {
                    let optionTag = `${option}Checkbox`;
                    return (
                        <Fragment key={optionTag}>
                            <input type="checkbox" id={optionTag} name={option}
                                   onChange={e => {
                                       if (e.target.checked) {
                                           websocket.sendTo
                                               .forEach(endpoint =>
                                                   wsClient.current.sendMessage(endpoint, e.target.name))
                                       }
                                   }}
                            />
                            <label htmlFor={optionTag}>{option}</label>
                        </Fragment>
                    )
                }
            )}
        </div>
    )
}