import axios from "axios";

export const login = async (user, callback) => {

    await axios.post("/login", user)
        .then((response) => {
                callback(JSON.stringify({message: `Welcome back, ${user.username}`, body: response.data})
                )
            }
            , (err) => {
                console.log(err);
                callback(JSON.stringify({message: "Error: user could not be logged in.", body: ""}))
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