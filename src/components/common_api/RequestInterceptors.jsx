import {CancelToken} from "axios";

let cancel;

export function postReqInterceptor(request) {
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
            balance: request.data.balance};

        return JSON.stringify(request.data);
    };

    return request;
};

export function getReqInterceptor(request, card) {
    request.headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + card.jwt
    };

    request.url = `/home/card/${card.account}`;
    request.method = "get";

    return request;
}

export function refreshTokenInterceptor(request) {
    request.headers = {
        "Content-Type": "application/json",
        "isRefreshToken": true
    };

    request.transformRequest = () => {
        request.data = {username: request.data.username, jwt: request.data.jwt};
        return JSON.stringify(request.data);
    };

    return request;
}

