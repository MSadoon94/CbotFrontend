 export const validateUsername = (name) => {
        try {
            isOnlyAlphanumerics(
                isNotGreaterThanMaxCharLength(
                    isNotAllWhiteSpace(
                        isNotNull(name)
                    )))
        } catch (err) {
            return err;
        }
        return "✔";
    };

    const isNotNull = (name) => {
        if(!name){
             throw "Username cannot be null or blank.";
        } else return name;
    };

    const isNotAllWhiteSpace = (name) => {
        if(!name.replace(/\s/g, "").length){
            throw "Username cannot be null or blank.";
        } else return name;
    };

    const isNotGreaterThanMaxCharLength = (name) => {
        if(name.length > 20){
            throw "Username cannot be longer than 20 characters.";
        } else return name;
    };

    const isOnlyAlphanumerics = (name) => {
        if(/\W+/gm.test(name)){
            throw "Username can only contain letters, numbers, or underscores.";
        } else return name;
    };