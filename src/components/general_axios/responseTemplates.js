//Any request to the backend that attempts to create an object.
export const create = (object) => {
    return {
        success: {message: `${object} was created successfully.`},
        fail: {message: `Error: ${object} could not be created.`}
    }
};

//Any request that requires validation of a query.
export const validation = (query) => {
    return {
        success: {message: "✔"},
        fail: {message: `${query} is invalid.`}
    }
};