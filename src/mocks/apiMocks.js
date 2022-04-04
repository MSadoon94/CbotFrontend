import {rest} from "msw";
import {HttpStatus} from "../components/common/httpStatus";
import {mockData, mockStatus} from "./mockData";
import {testServer} from "./testServer";

const URL = "http://localhost";
export const failedRequest = (restMethod, endpoint, statusCode = HttpStatus.badRequest, message = null) => {
    testServer.use(restMethod(`${URL}${endpoint}`,
        (req, res, context) => {
            return res(context.status(statusCode), context.json({message}));
        }))
};
export const apiMocks = [
    rest.post(`${URL}/login`,
        (req, res, context) =>
            res(context.status(HttpStatus.ok), context.json({expiration: "expirationMock"}))
    ),
    rest.post(`${URL}/sign-up`,
        (req, res, context) =>
            res(context.status(HttpStatus.created))
    ),
    rest.post(`${URL}/user/card`,
        (req, res, context) =>
            res(context.status(HttpStatus.created))
    ),
    rest.post(`${URL}/refresh-jwt`,
        (req, res, context) =>
            res(context.status(HttpStatus.ok), context.json({expiration: "newExpiration"}))
    ),
    rest.delete(`${URL}/log-out`,
        (req, res, context) =>
            res(context.status(HttpStatus.ok))
    ),
    rest.get(`${URL}/asset-pair/:base/:quote/:brokerage`,
        (req, res, context) =>
            res(context.status(HttpStatus.ok), context.json({result: "asset pair information"}))
    ),
    rest.post(`${URL}/user/strategy`,
        (req, res, context) =>
            res(context.status(HttpStatus.created))
    ),
    rest.get(`${URL}/user/cards`,
        (req, res, context) =>
            res(context.status(HttpStatus.ok), context.json(mockData.cards))
    ),
    rest.post(`${URL}/user/card-password`,
        (req, res, context) =>
            res(context.status(HttpStatus.ok))
    ),
    rest.get(`${URL}/user/card/:cardName`,
        (req, res, context) =>
            res(context.status(HttpStatus.ok), context.json(mockData.card))
    ),
    rest.get(`${URL}/user/strategies`,
        (req, res, context) =>
            res(context.status(HttpStatus.ok), context.json(mockData.strategies))
    ),
    rest.get(`${URL}/user/strategy/:strategy`,
        (req, res, context) =>
            res(context.status(HttpStatus.ok), context.json(mockData.strategy))
    ),
    rest.put(`${URL}/user/cbot-status`,
        (req, res, context) =>
            res(context.status(HttpStatus.ok))
    ),
    rest.get(`${URL}/user/cbot-status`,
        (req, res, context) =>
            res(context.status(HttpStatus.ok), context.json(mockStatus()))
    )
];
