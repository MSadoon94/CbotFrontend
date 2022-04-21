import {Fragment, useContext, useEffect, useState} from "react";
import {WebSocketContext} from "../../App";

export const CheckboxWidget = ({
                                   type,
                                   websocket = null,
                                   fields = {option: "option", isChecked: "isChecked"}
                               }) => {
    const {wsMessages, wsClient} = useContext(WebSocketContext);
    const [options, setOptions] = useState(([{option: null, isChecked: false}]));

    useEffect(() => {
        if (wsMessages[websocket.initial]) {
            let messages = [...new Set(wsMessages[websocket.initial]
                .filter(Boolean)
                .map(message => ({option: message[fields.option], isChecked: message[fields.isChecked]})))]
            setOptions(messages);
        }
    }, [])

    useEffect(() => {
        if (wsMessages[websocket.topic]) {
            setOptions(wsMessages[websocket.topic])
        }
    }, [wsMessages]);

    return (
        <div id={`${type}checkboxWidget`}>
            {options.map(entry => {
                    let optionTag = `${entry[fields.option]}Checkbox`;
                    return (
                        <Fragment key={optionTag}>
                            <input type="checkbox" id={optionTag} name={entry[fields.option]}
                                   onChange={e => wsClient.current.sendMessage(
                                       websocket.sendTo.concat(`/${e.target.name}/${e.target.checked}`))
                                   }
                            />
                            <label htmlFor={optionTag}>{entry[fields.option]}</label>

                        </Fragment>
                    )
                }
            )}
        </div>
    )
}