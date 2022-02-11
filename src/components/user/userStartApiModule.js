import {publicConfig} from "../api/apiUtil";
import {create, load} from "../api/responseTemplates";

export const userStartIds = {
    loginResponse: "loginResponse",
    signupResponse: "signupResponse"
}

export const loginApiModule = (user) => {
    return {
        config: publicConfig({url: "/api/login", method: "post"}, user),
        templates: load("User")
    }
}

export const signupApiModule = (user) => {
    return {
        config: publicConfig({url: "/api/sign-up", method: "post"}, user),
        templates: create("User")
    }
}