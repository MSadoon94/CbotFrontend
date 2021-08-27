import axios from "axios";

export const refreshJwt = async (user, interceptor, callback) => {

    const reqInterceptor = axios.interceptors.request.use(
        request => interceptor(request),
        (err) => {
            return Promise.reject(err);
        });

    await axios.post("api/refreshjwt", user)
        .then((response) => {
            callback(JSON.stringify({message: "Successfully refreshed jwt token.", body: response.data}));
        }, (err) => {
            console.log(err);
            callback(JSON.stringify({message: "Refresh token has expired, logging out."}));
        });

    axios.interceptors.request.eject(reqInterceptor);
};