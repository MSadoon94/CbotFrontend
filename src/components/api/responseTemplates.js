//Any request to the backend that attempts to create an object.
export const create = (object) => {
    return {
        success: `${object} was created successfully.`,
        fail: `Error: ${object} could not be created.`
    }
};

//Any request that requires validation of a query.
export const validation = (query) => {
    return {
        success: "✔",
        fail: `${query} is invalid.`
    }
};

//Any request that attempts to save an object.
export const save = (object) => {
    return {
        success: `${object} was saved successfully.`,
        fail: `Error: ${object} could not be saved.`
    }
};

//Any request that attempts to load an object.
export const load = (object) => {
    return {
        success: `${object} was loaded successfully.`,
        fail: `Error: ${object} could not be loaded.`
    }
};

//Any request that attempts to load a collection.
export const loadGroup = (group) =>{
  return {
      success: `${group} were loaded successfully.`,
      fail: `Error: ${group} could not be loaded.`
  }
};

//Any request that attempts an action that changes state.
export const changeState = (action) => {
    return {
        success: `${action} was successful.`,
        fail: `Error: ${action} could not be complete.`
    }
};