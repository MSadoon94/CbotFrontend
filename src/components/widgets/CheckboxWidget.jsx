import {Fragment, useContext, useEffect, useState} from "react";
import {WebSocketContext} from "../../App";

export const CheckboxWidget = ({
                                   type,
                                   websocket = null,
                                   fields = {option: "option", isChecked: "isChecked"}
                               }) => {
    const {wsMessages, wsClient} = useContext(WebSocketContext);
    const [options, setOptions] = useState([{[fields.option]: null, [fields.isChecked]: false}]);

    useEffect(() => {
        if (wsMessages[websocket.initial]) {
            addOptions(wsMessages[websocket.initial]);
        }
    }, [wsMessages[websocket.initial]])

    useEffect(() => {
        if (wsMessages[websocket.topic]) {
            addOptions(wsMessages[websocket.topic]);
        }
    }, [wsMessages[websocket.topic]]);

    const addOptions = (wsPayload) => {
        let messages = wsPayload
            .map(message => ({[fields.option]: message[fields.option], [fields.isChecked]: message[fields.isChecked]}));
        setOptions(messages)
    }

    return (
        <div id={`${type}checkboxWidget`}>
            {options.filter(entry => entry[fields.option])
                .map(entry => {
                        let optionTag = `${entry[fields.option]}Checkbox`;
                        return (
                            <Fragment key={optionTag}>
                                <input type="checkbox" id={optionTag} name={entry[fields.option]}
                                       onChange={e => {
                                           wsClient.current.sendMessage(
                                               websocket.sendTo,
                                               JSON.stringify({...entry, [fields.isChecked]: e.target.checked})
                                           )
                                       }}
                                />
                                <label htmlFor={optionTag}>{entry[fields.option]}</label>

                            </Fragment>
                        )
                    }
                )}
        </div>
    )
}