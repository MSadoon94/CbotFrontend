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
            .flatMap(topic => wsMessages[topic])
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
                                       websocket.sendTo
                                           .forEach(endpoint =>
                                               wsClient.current.sendMessage(
                                                   endpoint.concat(`/${e.target.name}/${e.target.checked}`)
                                               ))
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