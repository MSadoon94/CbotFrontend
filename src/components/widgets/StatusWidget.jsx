import React, {useEffect, useReducer} from "react";
import "./widgets.css";
import {changeCbotStatus, getCbotStatus, widgetIds} from "./widgetApiModule";
import {useApi} from "../api/useApi";

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
    const [sendGetStatusRequest, getStatusResponse, ] = useApi();
    const [sendSaveStatusRequest,, ] = useApi();

    useEffect(() => {
        if(state.type === apiStates.get){
            getStatus();
        } else if(state.type === apiStates.put){
            changeStatus();
        }
    }, [state.type])

    const togglePower = () => {
        dispatch({type: apiStates.put});
    }

    const getStatus = () => {
        sendGetStatusRequest(getCbotStatus({
            onComplete: {
                success: ({body}) =>
                    dispatch({type: powerButtonStates[body.isActive], strategies: body.activeStrategies}),
                fail: () => null
            }
        }));
    }
    const changeStatus = () => {
        let actions = {
            onComplete: {
                success: () => dispatch({type: powerButtonStates[state.isActive], strategies: state.strategies}),
                fail: () => null
            }}
        sendSaveStatusRequest(changeCbotStatus(actions, {
            isActive: state.isActive,
            activeStrategies: state.strategies
        }))

    }

    return (
        <div className={"statusWidget"}>
            <output id={widgetIds.getCbotStatusRequest} data-testid={widgetIds.getCbotStatusRequest}
                    data-issuccess={getStatusResponse.isSuccess}>{getStatusResponse.message}</output>

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