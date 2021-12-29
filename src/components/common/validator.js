export function validateUsername(name) {
    const validator = new Validator(name, "Username");
    try {
        validator.isNotNull()
            .isNotAllWhiteSpaces()
            .isNotGreaterThanMaxLength(20)
            .isOnlyAlphanumerics();
    } catch (err) {
        return err.message;
    }
    return "✔";
}

export function validatePassword(password, secondPassword) {
    const validator = new Validator(password, "Password");
    try {
        validator.isNotNull()
            .isNotAllWhiteSpaces()
            .isNotGreaterThanMaxLength(20)
            .isNotLessThanMinimumLength(8)
            .hasAtLeastOneSpecialCharacter()
            .hasAtLeastOneUpperCaseLetter()
            .hasNoWhiteSpace()
            .hasAtLeast1Number()
            .matchesSecondPassword(secondPassword);

    } catch (err) {
        return err.message;
    }
    return "✔";
}

function Validator(input, validation) {

    this.input = input;
    this.validation = validation;
    Validator.prototype.result = null;

    const success = () => {
        this.result = input;
        return this;
    }

    Validator.prototype.isOnlyAlphanumerics = function () {
        if (/\W+/gm.test(input)) {
            throw Error("Username can only contain letters, numbers, or underscores.");
        } else {
            return success();
        }
    };

    Validator.prototype.isNotNull = function () {
        if (!input) {
            throw Error(`${validation} cannot be null or blank.`);
        } else {
            return success();
        }
    };

    Validator.prototype.isNotAllWhiteSpaces = function () {
        if (!input.replace(/\s/gm, "").length) {
            throw Error(`${validation} cannot be null or blank.`);
        } else {
            return success();
        }
    };

    Validator.prototype.isNotGreaterThanMaxLength = function (maxLength) {
        if (input.length > maxLength) {
            throw Error(`${validation} cannot be longer than ${maxLength} characters.`);
        } else {
            return success();
        }
    };

    Validator.prototype.isNotLessThanMinimumLength = function (minLength) {
        if (input.length < minLength) {
            throw Error(`${validation} cannot be shorter than ${minLength} characters.`);
        } else {
            return success();
        }
    };

    Validator.prototype.hasAtLeastOneSpecialCharacter = function () {
        if (!/\W+/gm.test(input)) {
            throw Error(`${validation} must contain at least 1 special character, e.g. '-', '%', etc...`);
        } else {
            return success();
        }
    };

    Validator.prototype.hasAtLeastOneUpperCaseLetter = function () {
        if (!/[A-Z]/gm.test(input)) {
            throw Error(`${validation} must contain at least 1 uppercase letter.`)
        } else {
            return success();
        }
    };

    Validator.prototype.hasNoWhiteSpace = function () {
        if (/\s/gm.test(input)) {
            throw Error(`${validation} cannot contain any white space.`)
        } else {
            return success();
        }
    };

    Validator.prototype.hasAtLeast1Number = function () {
        if (!/[\d]/gm.test(input)) {
            throw Error(`${validation} must contain at least 1 number.`)
        } else {
            return success();
        }
    }

    Validator.prototype.matchesSecondPassword = function (secondPassword) {
        if(input !== secondPassword){
            throw Error(`${validation}s do not match.`)
        } else {
            return success();
        }
    }
}