//Any request to the backend that attempts to create an object.
export const create = (object) => {
    return {
        success: `${object} was created successfully.`,
        fail: {message: `Error: ${object} could not be created.`}
    }
};

//Any request that requires validation of a query.
export const validation = (query) => {
    return {
        success: "✔",
        fail: {message: `${query} is invalid.`}
    }
};

//Any request that attempts to save an object.
export const save = (object) => {
    return {
        success: `${object} was saved successfully.`,
        fail: {message: `Error: ${object} could not be saved.`}
    }
};

//Any request that attempts to load an object.
export const load = (object) => {
    return {
        success: `${object} was loaded successfully.`,
        fail: {message: `Error: ${object} could not be loaded.`}
    }
};