import {ApiContext} from "./ApiManager";
import {useContext, useEffect, useReducer, useRef, useState} from "react";
import {apiHandler} from "./apiUtil";
import {HttpRange} from "../common/httpStatus";
import _ from "lodash";

export const ApiResponseWrapper = ({
                                       apiModule: {
                                           id, config, actions, templates,
                                           apiControl= () => false,
                                           isHidden = false,
                                           outputPath = "message"
                                       }
                                   }) => {

    const [request, setRequest] = useState(null);
    useEffect(() => {
        if(apiControl()){
            setRequest({config, actions, templates});
        } else {
            setRequest(null);
        }
    }, [apiControl])

    return <ApiResponse cssId={id} request={request} isHidden={isHidden} outputPath={outputPath}/>
}
const initialResponse = {status: "", message: "", body: ""};

const reducer = (state, action) => {
    let type, request;
    let response = {...initialResponse}
    switch (action.type){
        case "newRequest" :
                type = action.type;
                request = action.request;
                break;
        case "waiting" :
                type= action.type;
                request = state.request;
                break;
        case "complete" :
                type = action.type;
                console.log(action);
                response = {
                    ...action.response,
                    isvalid: HttpRange.success.test(action.response.status)
                };
                break;
    }
    return {type, request, response};
}

export const ApiResponse = ({cssId, request, isHidden = false, outputPath = "message"}) => {
    const stateTypes = {initial: "initial", newRequest: "newRequest", waiting: "waiting", complete: "complete"}

    const {addRequest, addIdAction} = useContext(ApiContext);
    const [output, setOutput] = useState(initialResponse);

    const apiRequest = useRef(request);

    const [state, dispatch] = useReducer(reducer, {type: stateTypes.initial, response: initialResponse})


    useEffect(() => {
        if (request && request.config) {
            let {config, templates, actions} = request;
            dispatch({type: stateTypes.newRequest, request: {config, handler: apiHandler(templates, actions)}})
        }
    }, [request]);

    useEffect(() => {
        if (state.type === stateTypes.newRequest){
            addRequest(state.request);
            dispatch({type: stateTypes.waiting})
        } else if(state.type === stateTypes.waiting){
            handleResponse();
        } else if(state.type === stateTypes.complete){
            if(state.response.message !== ""){
                setTimeout(() => {
                    dispatch({type: stateTypes.complete, response: initialResponse});
                }, 5000);
            }
        }
    }, [state.type])


    const handleResponse = async () => {
        let {checkProgress, actions} = state.request.handler;
        let response;
        await checkProgress()
            .then(
                (res) => response = {...res, isResolved: true},
                (err) => response = {...err, isResolved: false}
            )
            .finally(() => {
                dispatch({type: stateTypes.complete, response});
                if (actions.idAction) {
                    addIdAction(actions.idAction);
                }
                if (actions.onComplete) {
                    doComplete(actions.onComplete, response)
                }
            });
    };

    const doComplete = (action, response) => {
        if (response.isResolved) {
            action.success(response);
        } else {
            action.fail(response);
        }
    };


    const hasSucceeded = () => {
        return HttpRange.success.test(output.status)
    };

    return (
        <output data-testid={cssId} id={cssId} hidden={isHidden}
                className={hasSucceeded() ? "valid" : "invalid"}>
            {hasSucceeded() ?
                _.get(output, outputPath, output.message) : output.message}
        </output>
    )
};