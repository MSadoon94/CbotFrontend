import {validateUsername} from "./validator";

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

    test("should reject usernames longer than 20 characters", () => {
        expect(validateUsername("abcdefghijklmnopqrstu")).toBe("Username cannot be longer than 20 characters.");
    });

    test.concurrent.each(["+", "~", "fsd%", "34g+5d"])("should only contain alphanumerics: %s", (input) => {
        expect(validateUsername(input)).toBe("Username can only contain letters, numbers, or underscores.");
    });

});