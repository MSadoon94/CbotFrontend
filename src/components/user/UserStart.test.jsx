import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {UserStart} from "./UserStart";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import {HttpCodes} from "../common/httpCodes";

let usernameTextbox, usernameValidityOutput, signupButton, loginButton;

jest.mock("axios");

beforeEach(() => {
    render(<UserStart/>);
    usernameTextbox = screen.getByRole("textbox", {name: "User Name"});
    usernameValidityOutput = screen.getByRole("status", {id: "usernameValidity"});
    signupButton = screen.getByRole("button", {name: "Create User"});
    loginButton = screen.getByRole("button", {name: "Login"});
});

describe("api responses", () => {

    test("should respond to duplicate usernames in sign up requests with error message", async () => {
        axios.post.mockImplementation(() => Promise.reject({request: {status: HttpCodes.conflict}}));

        userEvent.type(usernameTextbox, "TestUser");
        await waitFor(() => userEvent.click(screen.getByRole("button", {name: "Create User"})));

        expect(usernameValidityOutput).toHaveTextContent("Username has been taken, please choose another.");
    });

});

describe("entering username", () => {

    test.concurrent.each(["TestUser", "testuser", "TestUser1", "testuser2", "TestUser_1"])
    ("should set username validity to checkmark for acceptable username: %s", async (input) => {
        userEvent.type(usernameTextbox, input);

        expect(usernameValidityOutput).toHaveTextContent("✔");
    });

    test.concurrent.each`
    type                |   input                  |error
    ${"null/blank"}     |${" "}                     |${"Username cannot be null or blank."}
    ${">20 characters"} |${"abcdefghijklmnopqrstu"}|${"Username cannot be longer than 20 characters."}
    ${"!alphanumeric"}  |${"34g+5d"}               |${"Username can only contain letters, numbers, or underscores."}
    
    `("should set username validity error for $type", async ({input, error}) => {
        userEvent.type(usernameTextbox, input);
        expect(usernameValidityOutput).toHaveTextContent(error);
    });

    test("should enable sign up and login buttons when username is acceptable",  () => {
        userEvent.type(usernameTextbox, "TestUser");

        expect(signupButton).toBeEnabled();
        expect(loginButton).toBeEnabled();
    });


    test("should disable sign up and login buttons when username is unacceptable", () => {
        userEvent.type(usernameTextbox, "#");

        expect(signupButton).not.toBeEnabled();
        expect(loginButton).not.toBeEnabled();
    });

});