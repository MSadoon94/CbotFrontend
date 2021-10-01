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
    return {...generalConfig(request, data), isPublic: false,};
};

export const publicConfig = (request, data) => {
    return {...generalConfig(request, data), isPublic: true};
};

const defaultActions = {idAction: null, onComplete: null};

export const apiHandler = (templates, actions = defaultActions) => {
    let handler = {
        output: null,
        isResponseReady: false,
        templates,
        actions
    };

    handler.onResponse = (res) => {
        if (actions.idAction) {
            actions.idAction.payload = res;
        }
        handler.output = res;
    };

    handler.checkProgress = () => {
        return new Promise((resolve, reject) => {
            let requestTimeout = setTimeout(() => {
                reject(`Request timeout: ${handler.output}`)
            }, 50000);
            setInterval(() => {
                if (handler.isResponseReady) {
                    clearTimeout(requestTimeout);
                    resolve(handler.output);
                }
            }, 250);
        })
    };

    return handler;
};