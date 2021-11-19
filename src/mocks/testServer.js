import {setupServer} from "msw/node";
import {apiMocks} from "./apiMocks";

export const testServer = setupServer(...apiMocks);

beforeAll(() => testServer.listen());
afterEach(() => testServer.resetHandlers());
afterAll(() => testServer.close());