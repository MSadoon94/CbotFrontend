import {Fragment, useContext, useEffect, useState} from "react";
import {WebSocketContext} from "../../App";
import "./widgets.css";

export const OptionWidget = ({
                                   category,
                                   format = "checkbox",
                                   websocket = null,
                                   fields = {option: "option", isChecked: "isChecked"}
                               }) => {
    const {wsMessages, wsClient} = useContext(WebSocketContext);
    const [options, setOptions] = useState({[fields.option]: null, [fields.isChecked]: false});

    useEffect(() => {
        if (wsMessages[websocket.initial]) {
            addOption(wsMessages[websocket.initial]);
        }
    }, [wsMessages[websocket.initial]])

    useEffect(() => {
        if (wsMessages[websocket.topic]) {
            addOption(wsMessages[websocket.topic]);
        }
    }, [wsMessages[websocket.topic]]);


    const addOption = (wsPayload) => {
        let messages = {};
        wsPayload
            .forEach(entry => messages[entry[fields.option]] = entry[fields.isChecked]);
        setOptions(messages);
    }

    const sendMessage = (entry, isChecked) => {
        wsClient.current.sendMessage(
            websocket.sendTo,
            JSON.stringify({[fields.option]: entry, [fields.isChecked]: isChecked}))
    }

    const getInputFormat = (optionTag, entry) => {
        switch (format) {
            case "checkbox" :
                return <input type={format} id={optionTag} name={entry}
                              onChange={e => sendMessage(entry, e.target.checked)}/>;
            case "range" :
                return <input className={`${category}Slider`} type={format} id={optionTag} name={entry}
                              data-isChecked={options[entry]}
                              min="0" max="10" defaultValue={JSON.parse(options[entry]) ? "10" : "0"}
                              onChange={e => {
                                  if (e.target.value === "10") {
                                      setOptions({...options, [entry]: true})
                                      sendMessage(entry, true);
                                  } else if (e.target.value === "0") {
                                      setOptions({...options, [entry]: false})
                                      sendMessage(entry, false);
                                  }
                              }}/>;
        }
    }
    return (
        <div id={`${category}OptionWidget`} >
            {Object.keys(options)
                .map(entry => {
                    let optionTag = `${entry}Option`;
                    return (
                        <Fragment key={optionTag}>
                            <label className="optionLabel" htmlFor={optionTag}>{entry}</label>
                            {getInputFormat(optionTag, entry)}
                        </Fragment>
                    )
                })}

        </div>
    )
}