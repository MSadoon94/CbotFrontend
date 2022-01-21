import {apiConfig} from "../api/apiUtil";
import {changeState, load} from "../api/responseTemplates";

export const changeCbotStatus = (setCbotStatus, cbotStatus, apiControl) => {
    let actions = {
        onComplete: {
            success: setCbotStatus,
            fail: () => null
        }
    }

    return {
        id: "changeCbotStatusRequest",
        config: apiConfig({url: "/api/user/cbot-status", method: "put"}, cbotStatus),
        actions,
        templates: changeState("Activation"),
        isHidden: true,
        apiControl
    }
}

export const getCbotStatus = (setCbotStatus, apiControl) => {
    let actions = {
        onComplete: {
            success: setCbotStatus,
            fail: () => null
        }
    }
    return {
        id: "getCbotStatusRequest",
        config: apiConfig({url: "/api/user/cbot-status", method: "get"}),
        actions,
        templates: () => ({...load("CbotStatus"), success: null}),
        apiControl
    }
}