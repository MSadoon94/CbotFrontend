import {ApiContext} from "./ApiManager";
import {useContext, useEffect, useRef, useState} from "react";
import {apiHandler} from "./apiUtil";
import {HttpRange} from "../common/httpStatus";
import _ from "lodash";

export const ApiResponse = ({cssId, request, isHidden = false, outputPath = "message"}) => {
    const initialResponse = {status: "", message: "", body: ""};
    const {addRequest, addIdAction} = useContext(ApiContext);
    const [output, setOutput] = useState(initialResponse);

    const apiRequest = useRef(request);
    const response = useRef(initialResponse);

    const handleRequest = () => {
        if (apiRequest.current) {
            addRequest(apiRequest.current);
            handleResponse();
        }
    };

    useEffect(() => {
        if (request && request.config) {
            let {config, templates, actions} = request;
            apiRequest.current = {config, handler: apiHandler(templates, actions)};
            handleRequest();
        }
    }, [request]);

    const handleResponse = async () => {
        let {checkProgress, actions} = apiRequest.current.handler;
        await checkProgress()
            .then(
                (res) => response.current = res,
                (err) => response.current = err
            )
            .finally(() => {
                setOutput(response.current);
                if (actions.idAction) {
                    addIdAction(actions.idAction);
                }

                if (actions.onComplete) {
                    doComplete(actions.onComplete)
                }
            });
    };

    const doComplete = (action) => {
        if (HttpRange.success.test(response.current.status)) {
            action.success(response.current);
        } else {
            action.fail(response.current);
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