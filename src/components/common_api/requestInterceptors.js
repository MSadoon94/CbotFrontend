import {CancelToken} from "axios";

let cancel;

export const postReqInterceptor = (request) => {
    request.headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + request.data.jwt
    };
    request.cancelToken = new CancelToken((c) => cancel = c);

    if (Date.now() >= Date.parse(request.data.expiration)) {
        cancel("Jwt expired");

    }
    request.transformRequest = () => {

        request.data = {
            account: request.data.account,
            password: request.data.password,
            balance: request.data.balance
        };

        return JSON.stringify(request.data);
    };

    return request;
};

export const refreshTokenInterceptor = (request) => {
    request.headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + request.data.jwt,
        "isRefreshToken": true
    };

    request.transformRequest = () => {
        request.data = {username: request.data.username};
        return JSON.stringify(request.data);
    };

    return request;
};

export const customReqInterceptor = (data) => {
    data.request.headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + data.jwt
    };
    return data.request;
};