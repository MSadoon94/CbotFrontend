import axios, {CancelToken} from "axios";
import {HttpCodes} from "../common/httpCodes";


let cancel;

export const apiRequest = async (config, handler) => {
    let reConfig = {...config};
    reConfig.cancelToken = new CancelToken((c) => cancel = c);

    if (Date.now() >= Date.parse(config.id.expiration)) {
        await refresh(reConfig, handler, (res) => {
            reConfig = res
        });
    }

    await axios.request(reConfig)
        .then((res) => {
            handler.onSuccess({status: res.status, message: handler.templates.success})
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


const refresh = async (config, handler, refreshed) => {
    let reConfig = {
        url: "api/refreshjwt",
        method: "post",
        headers: {...config.headers, "isRefreshToken": true},
        data: config.id.username,
    };

    await axios.request(reConfig)
        .then((res) => {
            console.log("Session refreshed.");
            refreshed({...config, jwt: res.data.jwt, expiration: res.data.expiration});
            handler.onRefresh({...config.id, jwt: res.data.jwt, expiration: res.data.expiration});
        })
        .catch((error) => {
            if (error.response.status === HttpCodes.unauthorized) {
                handler.onFail("Session expired, logging out.");
                handler.onRefresh({...config.id, isLoggedIn: false});
            } else {
                failSafe(error, handler);
            }
            cancel(handler.output);
        })

};

const failSafe = (error, handler) => {
    if (error.response.status >= HttpCodes.internalServerError) {
        handler.onFail("Sorry, the server did not respond, please try again later.");
    } else {
        handler.onFail(handler.templates.fail);
    }
};


