import axios from "axios";

export const addCard = async (card, interceptor, callback) => {

    const reqInterceptor = axios.interceptors.request.use(
        request => interceptor(request),
        (err) => {
            return Promise.reject(err);
        });

    await axios.post("api/home/card", card)
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

};

export const getCard = async (card, interceptor, callback) => {

    const reqInterceptor = axios.interceptors.request.use(
        request => interceptor({jwt: card.jwt, request}),
        (err) => {
            return Promise.reject(err);
        });

    await axios.get(`api/home/card/${card.account}`)
        .then((response) => {
            callback(JSON.stringify({message: response.data}));
        }, (err) => {
            console.log(err);
            callback(JSON.stringify({message: `Error: ${card.account} could not be retrieved`}))
        });

    axios.interceptors.request.eject(reqInterceptor);
};


