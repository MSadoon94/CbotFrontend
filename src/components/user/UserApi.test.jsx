import React from "react";
import {login} from "./UserApi";
import {testServer} from "../../mocks/testServer";
import {rest} from "msw";
const user = {username: "user", password: "pass", authority: "USER"};
let outcome;

test("should return welcome message for successful logins", async () => {
    await login((user), (res) => outcome = JSON.parse(res));

    expect(outcome.message).toBe(`Welcome back, ${user.username}`);
});

test("should return jwt for successful logins", async () => {
    await login((user), (res) => outcome = JSON.parse(res));

    expect(outcome.jwt).toBe("jwtMock");
})

test("should return error message for failed logins", async () => {
    const URL = "http://localhost";
    testServer.use(rest.post("http://localhost/login",
        (req, res, context) => {
            return res(context.status(400));
        }));
    await login((user), (res) => outcome = JSON.parse(res));


    expect(outcome.message).toBe("Error: user could not be logged in.")
})
