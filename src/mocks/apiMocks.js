import {rest} from "msw";

const URL = "http://localhost";

const apiMocks = [
    rest.post(`${URL}/login`,
        (req, res, context) => {
        return res(context.status(200), context.body("jwtMock"));
    })
];

export { apiMocks, rest };