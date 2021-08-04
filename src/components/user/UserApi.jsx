import axios from "axios";

export const login = async (user, callback) => {

    await axios.post("/login", user)
        .then((response) => {
                callback(JSON.stringify({message: `Welcome back, ${user.username}`, body: response.data})
                )
            }
            , (err) => {
                console.log(err);
                if (err.request.status >= 500) {
                    callback(JSON.stringify({message: "Sorry, the server did not respond, please try again later."}))
                } else callback(JSON.stringify({message: "Error: user could not be logged in."}))
            });
};

export const signup = async (user, callback) => {

    await axios.post("/signup", user)
        .then(() => {
                callback(JSON.stringify({message: `${user.username} was created successfully.`})
                )
            }
            , (err) => {
                console.log(err);
                callback(JSON.stringify({message: `Error: ${user.username} could not be created.`}))
            });
};

export const logout = async (user, interceptor, callback) => {

    const reqInterceptor = axios.interceptors.request.use(
        request => interceptor({jwt: user.jwt, request}),
        (err) => {
            return Promise.reject(err)
        });

    await axios.delete("/logout/")
        .then(() => {
            callback(JSON.stringify({message: `${user.username} has been logged out.`}));
        }, (err) => {
            console.log(err);
            callback(JSON.stringify({message: `${user.username} is already logged out.`}));
        });

    axios.interceptors.request.eject(reqInterceptor);
};