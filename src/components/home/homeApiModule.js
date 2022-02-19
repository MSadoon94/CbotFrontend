import {apiConfig} from "../api/apiUtil";
import {changeState} from "../api/responseTemplates";

export const homeIds = {
    logoutRequest: "logoutRequest",
}

export const logoutApiModule = () => {
    return {
        config: apiConfig({url: "/log-out", method: "delete"}, null),
        templates: changeState("Logout")
    }
}