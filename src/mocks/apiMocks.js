import {rest} from "msw";
import {HttpStatus} from "../components/common/httpStatus";

const URL = "http://localhost/api";
const card = {account: "account", password: "password"};
const apiMocks = [
    rest.post(`${URL}/login`,
        (req, res, context) => {
            return res(context.status(HttpStatus.ok), context.json({jwt: "jwtMock", expiration: "expirationMock"}));
        }),
    rest.post(`${URL}/signup`,
        (req, res, context) => {
            return res(context.status(HttpStatus.created));
        }),
    rest.post(`${URL}/home/card`,
        (req, res, context) => {
            return res(context.status(HttpStatus.created));
        }),
    rest.get(`${URL}/home/card/:account`,
        (req, res, context) => {
            return res(context.status(HttpStatus.ok), context.json(card))

        }),
    rest.post(`${URL}/refreshjwt`,
        (req, res, context) => {
            return res(context.status(HttpStatus.ok), context.json({jwt: "refreshedJwt", expiration: "newExpiration"}))
        }
    ),
    rest.delete(`${URL}/log-out`,
        (req, res, context) => {
            return res(context.status(HttpStatus.ok));
        }),
    rest.get(`${URL}/asset-pair/:assets/:brokerage`,
        (req, res, context) => {
            return res(context.status(HttpStatus.ok), context.json({result: "asset pair information"}))
        }),
    rest.post(`${URL}/save-strategy`,
        (req, res, context) => {
            return res(context.status(HttpStatus.created));
        })
];

export {apiMocks, rest};