export function validateUsername(name) {
    let validation = "Username";
    const validator = new Validator(name, validation);
    try {
        validator.isNotNull()
            .isNotAllWhiteSpaces()
            .isNotGreaterThanMaxLength(20)
            .isOnlyAlphanumerics();
    } catch (err) {
        return err;
    }
    return "✔";
}

export function validatePassword(password) {
    let validation = "Password";
    const validator = new Validator(password, validation);
    try {
        validator.isNotNull()
            .isNotAllWhiteSpaces()
            .isNotGreaterThanMaxLength(20)
            .isNotLessThanMinimumLength(8)
            .hasAtLeastOneSpecialCharacter()
            .hasAtLeastOneUpperCaseLetter()
            .hasNoWhiteSpace()
            .containsAtLeast1Number();

    } catch (err) {
        return err;
    }
    return "✔";
}

function Validator(input, validation) {

    this.input = input;
    this.validation = validation;
    Validator.prototype.result = null;

    Validator.prototype.isOnlyAlphanumerics = function () {
        if (/\W+/gm.test(input)) {
            throw "Username can only contain letters, numbers, or underscores.";
        } else {
            this.result = input;
            return this;
        }
    };

    Validator.prototype.isNotNull = function () {
        if (!input) {
            throw `${validation} cannot be null or blank.`;
        } else {
            this.result = input;
            return this;
        }
    };

    Validator.prototype.isNotAllWhiteSpaces = function () {
        if (!input.replace(/\s/gm, "").length) {
            throw `${validation} cannot be null or blank.`;
        } else {
            this.result = input;
            return this;
        }
    };

    Validator.prototype.isNotGreaterThanMaxLength = function (maxLength) {
        if (input.length > maxLength) {
            throw `${validation} cannot be longer than ${maxLength} characters.`;
        } else {
            this.result = input;
            return this;
        }
    };

    Validator.prototype.isNotLessThanMinimumLength = function (minLength) {
        if (input.length < minLength) {
            throw `${validation} cannot be shorter than ${minLength} characters.`;
        } else {
            this.result = input;
            return this;
        }
    };

    Validator.prototype.hasAtLeastOneSpecialCharacter = function () {
        if (!/\W+/gm.test(input)) {
            throw `${validation} must contain at least 1 special character, e.g. '-', '%', etc...`;
        } else {
            this.result = input;
            return this;
        }
    };

    Validator.prototype.hasAtLeastOneUpperCaseLetter = function () {
        if (!/[A-Z]/gm.test(input)) {
            throw `${validation} must contain at least 1 uppercase letter.`
        } else {
            this.result = input;
            return this;
        }
    };

    Validator.prototype.hasNoWhiteSpace = function () {
        if (/\s/gm.test(input)) {
            throw `${validation} cannot contain any white space.`
        } else {
            this.result = input;
            return this;
        }
    };

    Validator.prototype.containsAtLeast1Number = function () {
        if (!/[\d]/gm.test(input)) {
            throw `${validation} must contain at least 1 number.`
        } else {
            this.result = input;
            return this;
        }
    }
}