import {apiConfig, apiHandler} from "../api/apiUtil";
import {changeState, load} from "../api/responseTemplates";

export const widgetIds = {
    getCbotStatusRequest: "getCbotStatusRequest",
    saveCbotStatusRequest: "saveCbotStatusRequest"
}

export const changeCbotStatus = (actions, cbotStatus) => {
    return {
        config: apiConfig({url: "/api/user/cbot-status", method: "put"}, cbotStatus),
        handler: apiHandler(changeState("CbotStatus"), actions),
    }
}

export const getCbotStatus = (actions) => {
    return {
        config: apiConfig({url: "/api/user/cbot-status", method: "get"}),
        handler: apiHandler({...load("CbotStatus"), success: null}, actions)
    }
}