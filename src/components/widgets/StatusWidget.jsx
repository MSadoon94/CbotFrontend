import {ApiResponseWrapper} from "../api/ApiResponse";
import React, {useReducer} from "react";
import "./widgets.css";
import {changeCbotStatus, getCbotStatus} from "./widgetApiModule";

const reducer = (state, action) => {
    switch (action.type) {
        case "getStatus":
            return {
                type: action.type,
                isTransition: true,
            }
        case "changeStatus":
            return {
                type: action.type,
                isActive: !state.isActive,
                isTransition: true,
                strategies: state.strategies,
            }
        case "active":
            return {
                type: action.type,
                isActive: true,
                isTransition: false,
                strategies: action.strategies
            }
        case "inactive":
            return {
                type: action.type,
                isActive: false,
                isTransition: false,
                strategies: action.strategies
            }
    }
}

export const StatusWidget = () => {
    const powerButtonStates = {true: "active", false: "inactive"}
    const apiStates = {put: "changeStatus", get: "getStatus"}
    const [state, dispatch] = useReducer(reducer, {type: apiStates.get, isTransition: true});

    const togglePower = () => {
        dispatch({type: apiStates.put});
    }

    const getStatus = ({body}) =>
        dispatch({type: powerButtonStates[body.isActive], strategies: body.activeStrategies})

    const changeStatus = () => {
        dispatch({type: powerButtonStates[state.isActive], strategies: state.strategies})
    }

    return (
        <div className={"statusWidget"}>
            <ApiResponseWrapper apiModule={getCbotStatus(getStatus, () => state.type === apiStates.get)}/>

            <ApiResponseWrapper apiModule={changeCbotStatus(changeStatus, {
                isActive: state.isActive,
                activeStrategies: state.strategies
            }, () => state.type === apiStates.put)}/>

            <button type={"button"}
                    id={"cbotPowerButton"}
                    data-power-status={powerButtonStates[state.isActive]}
                    disabled={state.isTransition}
                    onClick={togglePower}>
                <div className={"button-progress"} data-transition={state.isTransition}></div>
            </button>

        </div>
    )
}