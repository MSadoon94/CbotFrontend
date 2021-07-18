import {rest} from "msw";

const URL = "http://localhost";
const card = {account: "account", password: "password"};
const apiMocks = [
    rest.post(`${URL}/login`,
        (req, res, context) => {
            return res(context.status(200), context.json({jwt: "jwtMock", expiration: "expirationMock"}));
        }),
    rest.post(`${URL}/signup`,
        (req, res, context) => {
            return res(context.status(200));
        }),
    rest.post(`${URL}/home/card`,
        (req, res, context) => {
            return res(context.status(200));
        }),
    rest.get(`${URL}/home/card/:account`,
        (req, res, context) => {
            const {account} = req.params;
            if (account === card.account) {
                return res(context.status(200), context.json(card))
            } else {
                return res(context.status(400))
            }
        }),
    rest.post(`${URL}/refreshjwt`,
        (req, res, context) => {
            return res(context.status(200), context.json({jwt: "refreshedJwt", expiration: "newExpiration"}))
        }
    )
];

export {apiMocks, rest};