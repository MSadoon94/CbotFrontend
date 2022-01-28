import {useContext, useState} from "react";
import {ApiContext} from "./ApiManager";
import {HttpRange} from "../common/httpStatus";

export const useApi = (timeToClearMs = 5000) => {
    const initialResponse = {status: "", message: "", body: "", isSuccess: false};
    const {addRequest, addIdAction} = useContext(ApiContext);
    const [response, setResponse] = useState(initialResponse);

    const clearResponseTimeout = setTimeout(() => {
        clearResponse();
    }, timeToClearMs)


    const sendRequest = async ({config, handler}) => {
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
        if(request.handler.actions){
            addIdAction(request.handler.actions.idAction)
            doComplete(request.handler, apiResponse)
        }
        clearTimeout(clearResponseTimeout);
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

    return [sendRequest, clearResponse, response]
}