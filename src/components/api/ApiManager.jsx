import {createContext, useEffect, useReducer, useState} from "react";
import {apiRequest} from "./apiRequest";
import {useHistory} from "react-router-dom";
import {initialId} from "../../App";

export const ApiContext = createContext({});

const idReducer = (id, action) => {
    let newId;
    switch (action.type) {
        case "refresh":
        case "login" :
            newId = action.payload.body;
            break;
        case "logout":
        default:
            newId = {initialId};
            break;
    }
    return newId;
};

export const ApiManager = ({children, userId}) => {
    const history = useHistory();
    const [requests, setRequests] = useState([]);
    const [id, setId] = useReducer(idReducer, userId);

    const doRequest = async (request, remaining) => {
        request.config = prepConfig(request);
        await apiRequest(request.config, request.handler)
            .then(() => {
                request.handler.isResponseReady = true;
                setRequests(remaining);
            });
    };

    useEffect(() => {
        if (requests.length !== 0) {
            let [request, ...rest] = requests;
            doRequest(request, rest);
        }
    }, [doRequest, requests]);

    useEffect(() => {
        if (!id.isLoggedIn) {
            history.push("/start")
        }
    }, [history, id]);

    const prepConfig = ({config}) => {
        if (!config.isPublic) {
            config.headers = {...config.headers, Authorization: `Bearer ${id.jwt}`};
        }
        return {...config, id, onRefresh: (refresh) => setId({type: refresh, payload: refresh})};
    };

    const addRequest = (request) => {
        setRequests(req => [...req, request]);
    };

    const addIdAction = (idAction) => {
        setId(idAction);
        idAction.execute(idAction.payload);
    };

    return (

        <ApiContext.Provider value={{addRequest, addIdAction}}>
            {children}
        </ApiContext.Provider>
    )
};
