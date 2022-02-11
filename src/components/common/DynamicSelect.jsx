import React, {useRef} from "react";
import {useApi} from "../api/useApi";
import {loadGroup} from "../api/responseTemplates";

export const DynamicSelect = ({selectSchema, onOptionsSet = () => null}) => {
    const defaultOption = `-- Load ${selectSchema.type} --`;
    const options = useRef([{name: defaultOption}]);
    const [sendRequest, response,] = useApi({isActive: false});

    const handleClick = async () => {
        await sendRequest({
            config: selectSchema.config,
            templates: loadGroup(selectSchema.type)
        }).then((res) => {
            options.current = mapResponse(res);
            onOptionsSet(res.body);
        })
    }

    const mapResponse = (res) => {
        return Object.keys(res.body)
            .map((key) => ({"name": key}))
            .filter(key => !options.current.some(option => option.name === key.name))
            .concat(options.current)
    }

    const handleChange = (selection) => {
        if (selection.target.value === defaultOption) {
            selectSchema.doDefault();
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