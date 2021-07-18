import axios from "axios";

export async function addCard(card, interceptor, callback) {

    const reqInterceptor = axios.interceptors.request.use(
        request => interceptor(request),
        (err) => {
            return Promise.reject(err);
        });

    await axios.post("/home/card", card)
        .then(() => {
                callback(JSON.stringify({message: `${card.account} was created successfully.`})
                );
            }
            , (err) => {
                if (err.message === "Jwt expired") {
                    console.log(err);
                    callback(JSON.stringify({message: err.message}))
                } else {
                    console.log(err);
                    callback(JSON.stringify({message: `Error: ${card.account} could not be created.`}));
                }
            });

    axios.interceptors.request.eject(reqInterceptor);

}

export async function getCard(card, interceptor, callback) {
    let request;

    const reqInterceptor = axios.interceptors.request.use(
        req => request = interceptor(req, card),
        (err) => {
            return Promise.reject(err);
        });

    await axios(request)
        .then((response) => {
            callback(JSON.stringify({message: response.data}));
        }, (err) => {
            console.log(err);
            callback(JSON.stringify({message: `Error: ${card.account} could not be retrieved`}))
        });

    axios.interceptors.request.eject(reqInterceptor);
}


