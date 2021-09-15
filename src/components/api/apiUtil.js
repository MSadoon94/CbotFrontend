export const apiConfig = (request, data, id) => {

    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + id.jwt
    };

    return {
        url: request.url,
        method: request.method,
        headers,
        id,
        data
    }
};

export const apiHandler = (templates, onRefresh) => {
    let handler = {
        output: null,
        templates,
        onSuccess: (res) => {
            handler.output = res
        },
        onFail: (res) => {
            handler.output = res
        },
        onRefresh,
    };

    return handler
};