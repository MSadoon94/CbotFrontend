import {apiHandler, publicConfig} from "../api/apiUtil";
import {create, load} from "../api/responseTemplates";

export const userStartIds = {
    loginResponse: "loginResponse",
    signupResponse: "signupResponse"
}

export const loginApiModule = (user, actions) => {
    return {
        config: publicConfig({url: "/api/login", method: "post"}, user),
        handler: apiHandler(load("User"), actions)
    }
}

export const signupApiModule = (user) => {
    return {
        config: publicConfig({url: "/api/sign-up", method: "post"}, user),
        handler: apiHandler(create("User"))
    }
}