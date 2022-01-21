import {rest} from "msw";
import {HttpStatus} from "../components/common/httpStatus";
import {mockData, mockStatus} from "./mockData";
import {testServer} from "./testServer";

const URL = "http://localhost/api";
export const failedRequest = (restMethod, endpoint, statusCode = HttpStatus.badRequest) => {
    testServer.use(restMethod(`http://localhost/${endpoint}`,
        (req, res, context) => {
            return res(context.status(statusCode));
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
    rest.post(`${URL}/save-card`,
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
    rest.get(`${URL}/asset-pair/:assets/:brokerage`,
        (req, res, context) =>
            res(context.status(HttpStatus.ok), context.json({result: "asset pair information"}))
    ),
    rest.post(`${URL}/save-strategy`,
        (req, res, context) =>
            res(context.status(HttpStatus.created))
    ),
    rest.get(`${URL}/load-cards`,
        (req, res, context) =>
            res(context.status(HttpStatus.ok), context.json(mockData.cards))
    ),
    rest.post(`${URL}/card-password`,
        (req, res, context) =>
            res(context.status(HttpStatus.ok))
    ),
    rest.get(`${URL}/load-a-card/:cardName`,
        (req, res, context) =>
            res(context.status(HttpStatus.ok), context.json(mockData.singleCard))
    ),
    rest.get(`${URL}/load-strategies`,
        (req, res, context) =>
            res(context.status(HttpStatus.ok), context.json(mockData.strategies))
        ),
    rest.get(`${URL}/load-strategy/:strategy`,
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
