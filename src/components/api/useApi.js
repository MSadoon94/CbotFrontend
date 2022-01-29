import {useContext, useState} from "react";
import {ApiContext} from "./ApiManager";
import {HttpRange} from "../common/httpStatus";

export const useApi = (clearOptions = {isActive: true, timeToClearMs: 10000}) => {
    const initialResponse = {status: "", message: "", body: "", isSuccess: false};
    const {addRequest, addIdAction} = useContext(ApiContext);
    const [response, setResponse] = useState(initialResponse);

    let clearResponseTimeout;

    const sendRequest = async ({config, handler}) => {
        if ((clearOptions.isActive) && (clearResponseTimeout)) {
            clearTimeout(clearResponseTimeout);
        }
        let request = {config, handler};
        addRequest(request);
        await request.handler.checkProgress()
            .then(
                (res) => finishRequest(request, {...res, isFulfilled: true}),
                (err) => finishRequest(request, {...err, isFulfilled: false})
            )

    }
    const finishRequest = async (request, apiResponse) => {
        apiResponse.isSuccess = HttpRange.success.test(apiResponse.status);
        setResponse(apiResponse);
        if (request.handler.actions) {
            addIdAction(request.handler.actions.idAction)
            doComplete(request.handler, apiResponse)
        }
        if (clearOptions.isActive) {
            clearResponseTimeout = setTimeout(() => {
                clearResponse();
            }, clearOptions.timeToClearMs)
        }
    }

    const doComplete = ({actions}, apiResponse) => {
        if (actions.onComplete) {
            apiResponse.isSuccess ?
                actions.onComplete.success(apiResponse) : actions.onComplete.fail(apiResponse);
        }
    };

    const clearResponse = () => {
        setResponse(initialResponse);
    }

    return [sendRequest, response, clearResponse]
}