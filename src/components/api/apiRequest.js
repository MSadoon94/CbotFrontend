import axios, {CancelToken} from "axios";
import {HttpStatus} from "../common/httpStatus";

let cancel;

const response = (status, message, body) => {
    return {status, message, body}
};

export const apiRequest = async (config, handler) => {
    config.cancelToken = new CancelToken((c) => cancel = c);

    if (!config.isPublic && isExpired(config)) {
        await refresh(config, handler, (res) => config = res);
    }

    await axios.request(config)
        .then((res) => {
            handler.onResponse(response(res.status, handler.templates.success, res.data))
        })
        .catch((error) => {
                if (axios.isCancel(error)) {
                    console.log(error.message);
                } else {
                    console.log(error.message);
                    failSafe(error, handler);
                }
            }
        );
};

const isExpired = (config) => {
    return Date.now() >= Date.parse(config.id.expiration);
};

const refresh = async (config, handler, refreshed) => {
    let reConfig = {
        url: "api/refreshjwt",
        method: "post",
        headers: {...config.headers, "isRefreshToken": true},
        data: config.id.username,
    };

    await axios.request(reConfig)
        .then((res) => {
            let {jwt, expiration} = res.data;
            console.log("Session refreshed.");
            refreshed({...config, jwt: res.data.jwt, expiration: res.data.expiration});
            handler.onRefresh({...config.id, jwt: res.data.jwt, expiration: res.data.expiration});
        })
        .catch((error) => {
            if (error.response.status === HttpStatus.unauthorized) {
                handler.onResponse(response(error.response.status, "Session expired, logging out.", null));
                handler.onRefresh({...config.id, isLoggedIn: false});
            } else {
                failSafe(error, handler);
            }
            cancel(handler.output);
        })

};

const failSafe = (error, handler) => {
    let {status, data} = error.response;
    if (status >= HttpStatus.internalServerError) {
        handler.onResponse(response(
            status,
            "Sorry, the server did not respond, please try again later.",
            null)
        );
    } else {
        handler.onResponse(response(status, handler.templates.fail, data));
    }
};


