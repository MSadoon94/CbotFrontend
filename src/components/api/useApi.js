import {useContext, useState} from "react";
import {HttpRange} from "../common/httpStatus";
import {apiRequest} from "./apiRequest";
import {SessionContext} from "../../App";

export const useApi = (clearOptions = {isActive: true, timeToClearMs: 10000}) => {
    const setSession = useContext(SessionContext);
    const initialResponse = {status: "", message: "", body: "", isSuccess: false};
    const [response, setResponse] = useState(initialResponse);

    let clearResponseTimeout;

    const sendRequest = async ({config, templates}) => {
        if ((clearOptions.isActive) && (clearResponseTimeout)) {
            clearTimeout(clearResponseTimeout);
        }
        return apiRequest(config, templates, setSession)
            .then(
                (res) => {
                    finishRequest({...res, isFulfilled: true})
                    return res;
                },
                (err) => {
                    finishRequest({...err, isFulfilled: false})
                    return err;
                }
            );
    }
    const finishRequest = async (apiResponse) => {
        apiResponse.isSuccess = HttpRange.success.test(apiResponse.status);
        setResponse(apiResponse);
        if (clearOptions.isActive) {
            clearResponseTimeout = setTimeout(() => {
                clearResponse();
            }, clearOptions.timeToClearMs)
        }
    }

    const clearResponse = () => {
        setResponse(initialResponse);
    }

    return [sendRequest, response, clearResponse, setSession]
}