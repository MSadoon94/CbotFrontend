import React from "react";
import {login, signup} from "./UserApi";
import {testServer} from "../../mocks/testServer";
import {rest} from "msw";

const user = {username: "user", password: "pass", authority: "USER"};

let outcome;

const loginRequest = async () => {
    await login((user), (res) => outcome = JSON.parse(res));
};

const signupRequest = async () => {
    await signup((user), (res) => outcome = JSON.parse(res));
};

const failedLogin = () => {
    testServer.use(rest.post("http://localhost/login",
        (req, res, context) => {
            return res(context.status(400));
        }));
};

const failedSignup = () => {
    testServer.use(rest.post("http://localhost/signup",
        (req, res, context) => {
            return res(context.status(400));
        }));
};

test("should return welcome message for successful logins", async () => {
    await loginRequest();

    expect(outcome.message).toBe(`Welcome back, ${user.username}`);
});

test("should return jwt for successful logins", async () => {
    await loginRequest();

    expect(outcome.jwt).toBe("jwtMock");
});

test("should return error message for failed logins", async () => {
    failedLogin();

    await loginRequest();

    expect(outcome.message).toBe("Error: user could not be logged in.")
});

test("should return user created message for successful sign ups", async () => {
    await signupRequest();

    expect(outcome.message).toBe(`${user.username} was created successfully.`);
});

test("should return error message for failed sign ups", async () => {
    failedSignup();

    await signupRequest();

    expect(outcome.message).toBe(`Error: ${user.username} could not be created.`);
});
