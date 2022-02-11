import axios from "axios";
import {HttpStatus} from "../common/httpStatus";

const response = (status, message, body = null) => {
    return {status, message, body}
};

export const apiRequest = async (config, templates, setSession = () => null) => {
    return axios.request(config)
        .then(
            (res) => {
                return response(res.status, templates.success, res.data)
            }, (error) => {
                if (error.response.status === HttpStatus.unauthorized) {
                    return refresh(setSession).then(
                        () => retryRequest(config, templates),
                        (refreshError) => {
                            console.log(refreshError.message);
                            return response(refreshError.status, "Session expired, logging out.");
                        }
                    )
                } else {
                    return failSafe(error, templates);
                }
            }
        )
};

const retryRequest = async (config, templates) => {
    return axios.request(config)
        .then((res) => {
                return response(res.status, templates.success, res.data)
            }
        )
}

export const refresh = async (setSession) => {

    let config = {
        url: "/api/refresh-jwt",
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "isRefreshToken": true
        },
    }

    return axios.request(config)
        .then(
            () => {
                localStorage.setItem("session", JSON.stringify({isExpired: false, isLoggedIn: true}));
                setSession({isExpired: false, isLoggedIn: true});
                console.log("Session refreshed.");
                return Promise.resolve();
            }, (error) => {
                localStorage.setItem("session", JSON.stringify({isExpired: true, isLoggedIn: false}));
                setSession({isExpired: true, isLoggedIn: false});
                console.log("Session refresh failed.");
                return Promise.reject(error);
            })
};

const failSafe = (error, templates) => {
    let {status, data} = error.response;
    let failResponse;
    if (status >= HttpStatus.internalServerError) {
        failResponse = response(
            status,
            "Sorry, the server did not respond, please try again later.",
            null)
    } else if (status === HttpStatus.conflict) {
        failResponse = response(
            status,
            data.message,
            null
        )
    } else {
        failResponse = response(status, templates.fail, data)
    }
    return failResponse;
};


