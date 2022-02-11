const generalConfig = ({url, method}, data) => {

    const headers = {
        "Content-Type": "application/json",
    };

    return {
        url,
        method,
        headers,
        data
    }

};

export const apiConfig = (request, data) => {
    return {...generalConfig(request, data), isPublic: false};
};

export const publicConfig = (request, data) => {
    return {...generalConfig(request, data), isPublic: true};
};