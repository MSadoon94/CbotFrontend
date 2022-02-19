import {apiConfig} from "../api/apiUtil";
import {changeState, load} from "../api/responseTemplates";

export const widgetIds = {
    getCbotStatusRequest: "getCbotStatusRequest",
    saveCbotStatusRequest: "saveCbotStatusRequest"
}

export const changeCbotStatus = (cbotStatus) => {
    return {
        config: apiConfig({url: "/user/cbot-status", method: "put"}, cbotStatus),
        templates: changeState("CbotStatus"),
    }
}

export const getCbotStatus = () => {
    return {
        config: apiConfig({url: "/user/cbot-status", method: "get"}),
        templates: {...load("CbotStatus"), success: null}
    }
}