import axios from "axios";

export const addCard = async (card, token, callback) => {

    const headers = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.jwt
        }
    };

    console.log(headers.headers.Authorization);

    await axios.post("/home/card", card, headers)
        .then(() => {
                callback(JSON.stringify({message: `${card.account} was created successfully.`})
                );
            }
            , (err) => {
                console.log(err);
                callback(JSON.stringify({message: `Error: ${card.account} could not be created.`}))
            });
};