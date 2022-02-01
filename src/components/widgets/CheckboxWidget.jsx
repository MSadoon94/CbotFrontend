import {Fragment, useEffect, useRef, useState} from "react";
import {useApi} from "../api/useApi";

export const CheckboxWidget = ({
                                   type, apiModule, isStale = () => false,
                                   onRequest = () => ({isReady: false, getRequest: () => null})
                               }) => {
    const [checked, setChecked] = useState({});
    const [sendOptionsRequest, optionsResponse, ] = useApi();
    const isStaleRef = useRef(isStale)

    useEffect(() => {
        if (onRequest().isReady) {
            let values = Object.entries(checked).filter(value => value);
            onRequest().getRequest(values.map(value => value[0]));
        }

    }, [onRequest().isReady])

    useEffect(() => {
        sendOptionsRequest(apiModule);
    }, [])

    useEffect(() => {
        isStaleRef.current = isStale;
        if (isStaleRef.current()) {
            sendOptionsRequest(apiModule);
            isStaleRef.current = () => false;
        }
    }, [isStale()])

    return (
        <div id={`${type}checkboxWidget`}>
            <output id={`get${type}Options`} data-testid={`get${type}Options`}
                    data-issuccess={optionsResponse.isSuccess}/>
            {Object.keys(optionsResponse.body).map((option) => {
                let optionTag = `${option}Checkbox`;
                return (
                    <Fragment key={optionTag}>
                        <input type={"checkbox"} id={optionTag} name={option}
                               onChange={(e) =>
                                   setChecked({...checked, [e.target.name]: e.target.checked})
                               }/>
                        <label htmlFor={optionTag}>{option}</label>
                    </Fragment>
                )
            })}
        </div>
    )
}