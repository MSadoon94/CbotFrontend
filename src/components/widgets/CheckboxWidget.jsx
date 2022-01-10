import {Fragment, useEffect, useRef, useState} from "react";
import {ApiResponse} from "../api/ApiResponse";

export const CheckboxWidget = ({type, apiModule, isStale = () => false}) => {
    const [options, setOptions] = useState({})
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
        setOptionsRequest(apiRequest());
    }, [])

    useEffect(() => {
        isStaleRef.current = isStale;
        if(isStaleRef.current()){
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
                        <input type={"checkbox"} id={optionTag}/>
                        <label htmlFor={optionTag}>{option}</label>
                    </Fragment>
                )
            })}
        </div>
    )
}