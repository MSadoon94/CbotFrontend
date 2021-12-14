import axios, {CancelToken} from "axios";
import {HttpStatus} from "../common/httpStatus";

let cancel;

const response = (status, message, body) => {
    return {status, message, body}
};

export const apiRequest = async (config, handler) => {
    config.cancelToken = new CancelToken((c) => cancel = c);

    if (!config.isPublic && isExpired(config)) {
        await silentRefresh(config, handler, (res) => config = res);
    }

    await axios.request(config)
        .then((res) => {
            handler.onResponse(response(res.status, handler.templates.success, res.data))
        })
        .catch((error) => {
                if (axios.isCancel(error)) {
                    console.log("Request canceled: ", error.message);
                } else {
                    console.log(error.message);
                    failSafe(error, handler);
                }
            }
        );
};

export const refresh = async (id, onRefresh, onResponse) => {

    let config = {
        url: "/api/refresh-jwt",
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "isRefreshToken": true
        },
        id
    }

    await axios.request(config)
        .then((res) => {
            let {expiration} = res.data;
            console.log("Session refreshed.");
            onRefresh({...config.id, expiration});
            onResponse.success();
        })
        .catch(() => {
                onRefresh({...config.id, isLoggedIn: false});
                onResponse.fail();
        })
}

const isExpired = (config) => {
    let expiration = config.id.expiration;
    if(!expiration){
        return true
    } else {
        return Date.now() >= Date.parse(expiration);
    }
};

const silentRefresh = async (config, handler, refreshed) => {
    let reConfig = {
        url: "/api/refresh-jwt",
        method: "post",
        headers: {...config.headers, "isRefreshToken": true},
        data: config.id.username,
    };

    await axios.request(reConfig)
        .then((res) => {
            let {expiration} = res.data;
            console.log("Session refreshed.");
            refreshed({...config, expiration});
            handler.onRefresh.success({...config.id, expiration});
        })
        .catch((error) => {

            if (error.response.status === HttpStatus.unauthorized) {
                handler.onResponse(response(error.response.status, "Session expired, logging out.", null));
            } else {
                failSafe(error, handler);
            }
            cancel(handler.output);
            handler.onRefresh.fail({...config.id, isLoggedIn: false});
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
    } else if(status === HttpStatus.conflict){
        handler.onResponse(response(
            status,
            data.message,
            null
        ))
    } else {
        handler.onResponse(response(status, handler.templates.fail, data));
    }
};


