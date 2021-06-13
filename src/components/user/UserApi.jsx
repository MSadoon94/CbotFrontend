import React from "react";
import axios from "axios";

export const login = async (user, callback) => {

    await axios.post("/login", user)
        .then((res) => {
            callback(JSON.stringify({message: `Welcome back, ${user.username}`, jwt: res.data})
            )}
            , (err) => {
                console.log(err)
                callback(JSON.stringify({message: "Error: user could not be logged in.", jwt: ""}))
            });
};