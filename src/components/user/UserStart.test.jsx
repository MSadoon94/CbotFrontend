import React from "react";
import {render, screen} from "@testing-library/react";
import {UserStart} from "./UserStart";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import {ApiManager} from "../api/ApiManager";
import {mockId} from "../../mocks/mockId";

let usernameTextBox, passwordTextBox, confirmPasswordTextBox, usernameValidityOutput,
    passwordValidityOutput, signupButton, loginButton;

jest.mock("axios");

beforeEach(() => {
    render(
        <ApiManager userId={mockId}>
            <UserStart/>
        </ApiManager>
    );

    usernameTextBox = screen.getByRole("textbox", {name: "User Name"});
    passwordTextBox = screen.getByRole("textbox", {name: "Password"});
    confirmPasswordTextBox = screen.getByRole("textbox", {name: "Confirm Password"});

    usernameValidityOutput = screen.getByTestId("usernameValidity");
    passwordValidityOutput = screen.getByTestId("passwordValidity");

    signupButton = screen.getByRole("button", {name: "Create User"});
    loginButton = screen.getByRole("button", {name: "Login"});
});


describe("entering username", () => {

    test.concurrent.each(["TestUser", "testuser", "TestUser1", "testuser2", "TestUser_1"])
    ("should set username output validity to checkmark for acceptable username: %s", async (input) => {
        userEvent.type(usernameTextBox, input);

        expect(usernameValidityOutput).toHaveTextContent("✔");
    });

    test.concurrent.each`
    type                |input                     |error
    ${"null/blank"}     |${" "}                    |${"Username cannot be null or blank."}
    ${">20 characters"} |${"abcdefghijklmnopqrstu"}|${"Username cannot be longer than 20 characters."}
    ${"!alphanumeric"}  |${"34g+5d"}               |${"Username can only contain letters, numbers, or underscores."}
    
    `("should set username output validity error for: $type", async ({input, error}) => {
        userEvent.type(usernameTextBox, input);
        expect(usernameValidityOutput).toHaveTextContent(error);
    });

});

describe("entering password", () => {

    test.concurrent.each`
    type                     |input                     |error
    ${"null/blank"}          |${" "}                    |${"Password cannot be null or blank."}
    ${">20 characters"}      |${"Abcdefghijklmnopqrs1-"}|${"Password cannot be longer than 20 characters."}
    ${"<8 characters"}       |${"Abc1-"}                |${"Password cannot be shorter than 8 characters."}
    ${"!special character"}  |${"Abcdef11"}             |${"Password must contain at least 1 special character, e.g. '-', '%', etc..."}
    ${"!uppercase"}          |${"abcdef1-"}             |${"Password must contain at least 1 uppercase letter."}
    ${"has white space"}     |${"Abcdef1 -"}            |${"Password cannot contain any white space."}
    ${"!number"}             |${"Abcdeff-"}             |${"Password must contain at least 1 number."}
    
    `("should set password output validity error for: $type", async ({input, error}) => {
        userEvent.type(passwordTextBox, input);

        expect(passwordValidityOutput).toHaveTextContent(error);
    });

});

describe("button function", () => {

    beforeEach(() => {
        userEvent.clear(usernameTextBox);
        userEvent.clear(passwordTextBox);
        userEvent.clear(confirmPasswordTextBox);

        userEvent.type(usernameTextBox, "TestUser");
        userEvent.type(passwordTextBox, "TestPassword1-");
        userEvent.type(confirmPasswordTextBox, "TestPassword1-")
    });

    test("should enable sign up and login buttons when text box values are acceptable", () => {
        expect(signupButton).toBeEnabled();
        expect(loginButton).toBeEnabled();
    });

    test("should disable sign up but not login button when both password entries don't match", () => {
        userEvent.clear(confirmPasswordTextBox);
        userEvent.type(confirmPasswordTextBox, "TestPassword1");

        expect(signupButton).not.toBeEnabled();
        expect(loginButton).toBeEnabled();
    });

    test("should disable sign up and login buttons when username is unacceptable", () => {
        userEvent.clear(usernameTextBox);
        userEvent.type(usernameTextBox, "#");

        expect(signupButton).not.toBeEnabled();
        expect(loginButton).not.toBeEnabled();
    });

    test("should disable sign up and login buttons when password is unacceptable", () => {
        userEvent.clear(passwordTextBox);
        userEvent.type(passwordTextBox, "TestPassword");

        expect(signupButton).not.toBeEnabled();
        expect(loginButton).not.toBeEnabled();
    });
});