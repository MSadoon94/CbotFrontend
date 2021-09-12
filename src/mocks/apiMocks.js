import {rest} from "msw";
import {HttpCodes} from "../components/common/httpCodes";

const URL = "http://localhost/api";
const card = {account: "account", password: "password"};
const apiMocks = [
    rest.post(`${URL}/login`,
        (req, res, context) => {
            return res(context.status(HttpCodes.ok), context.json({jwt: "jwtMock", expiration: "expirationMock"}));
        }),
    rest.post(`${URL}/signup`,
        (req, res, context) => {
            return res(context.status(HttpCodes.created));
        }),
    rest.post(`${URL}/home/card`,
        (req, res, context) => {
            return res(context.status(HttpCodes.created));
        }),
    rest.get(`${URL}/home/card/:account`,
        (req, res, context) => {
            const {account} = req.params;
            if (account === card.account) {
                return res(context.status(HttpCodes.ok), context.json(card))
            } else {
                return res(context.status(HttpCodes.badRequest))
            }
        }),
    rest.post(`${URL}/refreshjwt`,
        (req, res, context) => {
            return res(context.status(HttpCodes.ok), context.json({jwt: "refreshedJwt", expiration: "newExpiration"}))
        }
    ),
    rest.delete(`${URL}/logout`,
        (req, res, context) => {
            return res(context.status(HttpCodes.ok));
        }),
    rest.get(`${URL}/asset-pair/:assets/:brokerage`,
        (req, res, context) => {
            return res(context.status(HttpCodes.ok), context.json({result: "asset pair information"}))
        }),
    rest.post(`${URL}/save-strategy`,
        (req, res, context) => {
        return res(context.status(HttpCodes.created));
    })
];

export {apiMocks, rest};