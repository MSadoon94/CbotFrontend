import {Fragment, useEffect, useRef, useState} from "react";
import {ApiResponse} from "../api/ApiResponse";

export const CheckboxWidget = ({
                                   type, apiModule, isStale = () => false,
                                   onRequest = () => ({isReady: false, getRequest: () => null})
                               }) => {
    const [options, setOptions] = useState({});
    const [checked, setChecked] = useState({});
    const isStaleRef = useRef(isStale)
    const apiRequest = () => {
        let {config, templates} = apiModule;

        let actions = {
            onComplete: {
                success: (res) => setOptions(res.body),
                fail: () => null
            }
        }
        return {config, templates, actions}
    }
    const [optionsRequest, setOptionsRequest] = useState();

    useEffect(() => {
        if (onRequest().isReady) {
            let values = Object.entries(checked).filter(value => value);
            onRequest().getRequest(values.map(value => value[0]));
        }

    }, [onRequest().isReady])

    useEffect(() => {
        setOptionsRequest(apiRequest());
    }, [])

    useEffect(() => {
        isStaleRef.current = isStale;
        if (isStaleRef.current()) {
            setOptionsRequest(apiRequest());
            isStaleRef.current = () => false;
        }
    }, [isStale()])

    return (
        <div id={`${type}checkboxWidget`}>
            <ApiResponse cssId={apiModule.id} isHidden={true} request={optionsRequest}/>
            {Object.keys(options).map((option) => {
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