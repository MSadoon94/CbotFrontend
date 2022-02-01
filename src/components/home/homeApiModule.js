import {apiConfig, apiHandler} from "../api/apiUtil";
import {changeState} from "../api/responseTemplates";

export const homeIds = {
    logoutRequest: "logoutRequest",
}

export const logoutApiModule = (actions) => {
    return {
        config: apiConfig({url: "/api/log-out", method: "delete"}, null),
        handler: apiHandler(changeState("Logout"), actions)
    }
}