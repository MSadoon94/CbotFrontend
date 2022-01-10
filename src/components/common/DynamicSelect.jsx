import React, {useState} from "react";
import {ApiResponse} from "../api/ApiResponse";

export const DynamicSelect = ({selectSchema, apiModule, onOptionsSet = () => null}) => {
    const defaultOption = `-- Load ${selectSchema.type} --`;
    const [options, setOptions] = useState([{name: defaultOption}]);
    const [loadOptionsRequest, setLoadOptionsRequest] = useState();

    const handleClick = () => {
        let actions = {
            onComplete: {
                success: (res) => {
                    setOptions(mapResponse(res));
                    onOptionsSet(res.body);
                },
                fail: () => null
            }
        };
        setLoadOptionsRequest({config: apiModule.config, templates: apiModule.templates, actions});
    }

    const mapResponse = (response) => {
        return Object.keys(response.body)
            .map((key) => ({"name": key}))
            .filter(key => !options.some(option => option.name === key.name))
            .concat(options)
    }

    const handleChange = (selection) => {
        if(selection.target.value === defaultOption){
            selectSchema.defaultAction();
        } else {
            selectSchema.doAction(selection.target.value);
        }
    }

    return (
        <>
            <ApiResponse cssId={apiModule.id} isHidden={true} request={loadOptionsRequest}/>
            <select id={selectSchema.id} onClick={() => handleClick()}
                    onChange={e => handleChange(e)}>
                {options.map((option) =>
                    <option key={option.name} value={option.name}>{option.name}</option>
                )}
            </select>
        </>
    )
}