import {validatePassword, validateUsername} from "./validator";

describe("username validation", () => {

    test.concurrent.each(["TestUser", "testuser", "TestUser1", "testuser2", "TestUser_1"])
    ("should output accept message for acceptable username: %s", (input) => {

        expect(validateUsername(input)).toBe("✔");
    });

    test("should reject null username", () => {
        expect(validateUsername(null)).toBe("Username cannot be null or blank.");
    });

    test("should reject blank usernames", () => {
        expect(validateUsername("")).toBe("Username cannot be null or blank.");
    });

    test("should reject usernames greater than 20 characters", () => {
        expect(validateUsername("abcdefghijklmnopqrstu")).toBe("Username cannot be longer than 20 characters.");
    });

    test.concurrent.each(["+", "~", "fsd%", "34g+5d"])("should only contain alphanumerics: %s", (input) => {
        expect(validateUsername(input)).toBe("Username can only contain letters, numbers, or underscores.");
    });

});

describe("password validation", () => {

    test("should reject null password", () => {
        expect(validatePassword(null)).toBe("Password cannot be null or blank.");
    });

    test("should reject blank password", () => {
        expect(validatePassword("")).toBe("Password cannot be null or blank.");
    });

    test("should reject passwords that are greater than 20 characters", () => {
        expect(validatePassword("Abcdefghijklmnopqrst1u-")).toBe("Password cannot be longer than 20 characters.");
    });

    test("should reject passwords that are less than 8 characters", () => {
        expect(validatePassword("Abc1-")).toBe("Password cannot be shorter than 8 characters.");
    });

    test("should contain at least 1 special character", () => {
        expect(validatePassword("Abcdef11"))
            .toBe("Password must contain at least 1 special character, e.g. '-', '%', etc...")
    });

    test("should contain at least 1 uppercase letter", () => {
        expect(validatePassword("abcdef1-")).toBe("Password must contain at least 1 uppercase letter.")
    });

    test("should not contain any white space", () => {
       expect(validatePassword("Abcdef1 -")).toBe("Password cannot contain any white space.")
    })

    test("should contain at least 1 number", () => {
        expect(validatePassword("Abcdeff-")).toBe("Password must contain at least 1 number.")
    })

});