import React, {useRef} from "react";
import {useApi} from "../api/useApi";
import {apiHandler} from "../api/apiUtil";
import {loadGroup} from "../api/responseTemplates";

export const DynamicSelect = ({selectSchema, onOptionsSet = () => null}) => {
    const defaultOption = `-- Load ${selectSchema.type} --`;
    const options = useRef([{name: defaultOption}]);
    const [sendRequest,response, ] = useApi({isActive: false});

    const handleClick = () => {
        let actions = {
            onComplete: {
                success: (res) => {
                    options.current = mapResponse(res);
                    onOptionsSet(res.body);
                },
                fail: () => null
            }
        };
        sendRequest({config: selectSchema.config, handler: apiHandler(loadGroup(selectSchema.type), actions)});
    }

    const mapResponse = (res) => {
        console.log(res);
        return Object.keys(res.body)
            .map((key) => ({"name": key}))
            .filter(key => !options.current.some(option => option.name === key.name))
            .concat(options.current)
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
            <select id={selectSchema.id} onClick={handleClick}
                    onChange={e => handleChange(e)}>
                {mapResponse(response).map((option) =>
                    <option key={option.name} value={option.name}>{option.name}</option>
                )}
            </select>
        </>
    )
}