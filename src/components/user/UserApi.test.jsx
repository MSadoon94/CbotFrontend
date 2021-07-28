import React from "react";
import {login, logout, signup} from "./UserApi";
import {testServer} from "../../mocks/testServer";
import {rest} from "msw";
import {customReqInterceptor} from "../common_api/RequestInterceptors";

const user = {username: "user", password: "pass", authority: "USER"};

let outcome;

const apiRequest = async (apiCall, model) => {
    await apiCall((model), (res) => outcome = JSON.parse(res))
};

const failedPostRequest = (endpoint) => {
    testServer.use(rest.post(`http://localhost/${endpoint}`,
        (req, res, context) => {
            return res(context.status(400));
        }))
};

const failedDeleteRequest = (endpoint) => {
    testServer.use(rest.delete(`http://localhost/${endpoint}`,
        (req, res, context) => {
            return res(context.status(400));
        }))
};

describe("login api", () => {
    test("should return welcome message for successful logins", async () => {
        await apiRequest(login, user);

        expect(outcome.message).toBe(`Welcome back, ${user.username}`);
    });

    test("should return jwt for successful logins", async () => {
        await apiRequest(login, user);

        expect(outcome.body.jwt).toBe("jwtMock");
    });

    test("should return jwt expiration for successful logins", async () => {
        await apiRequest(login, user);

        expect(outcome.body.expiration).toBe("expirationMock");
    });

    test("should return error message for failed logins", async () => {
        failedPostRequest("login");

        await apiRequest(login, user);

        expect(outcome.message).toBe("Error: user could not be logged in.")
    });
});

describe("signup api", () => {
    test("should return user created message for successful sign ups", async () => {
        await apiRequest(signup, user);

        expect(outcome.message).toBe(`${user.username} was created successfully.`);
    });

    test("should return error message for failed sign ups", async () => {
        failedPostRequest("signup");

        await apiRequest(signup, user);

        expect(outcome.message).toBe(`Error: ${user.username} could not be created.`);
    });
});

describe("logout api", () => {

    test("should return user logged out message for successful log outs", async () => {
        await logout(user, customReqInterceptor, (res) => outcome = JSON.parse(res));

        expect(outcome.message).toBe(`${user.username} has been logged out.`);
    });

    test("should return error message for failed log outs", async () => {
        failedDeleteRequest("logout");

        await logout(user, customReqInterceptor, (res) => outcome = JSON.parse(res));

        expect(outcome.message).toBe(`${user.username} is already logged out.`);
    });

});






