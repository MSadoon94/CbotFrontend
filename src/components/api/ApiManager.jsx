import {createContext, useEffect, useReducer, useState} from "react";
import {apiRequest, refresh} from "./apiRequest";
import {useHistory} from "react-router-dom";
import {initialId} from "../../App";

export const ApiContext = createContext({});

const idReducer = (id, action) => {
    let newId;
    switch (action.type) {
        case "refreshed":
        case "login" :
            newId = action.payload.body;
            break;
        case "logout":
        default:
            newId = initialId;
            break;
    }
    localStorage.setItem("isLoggedIn", newId.isLoggedIn);
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
        let onResponse = {
            success: () => history.push("/home"),
            fail: () => history.push("/start")
        }
        if (localStorage.getItem("isLoggedIn") === "false") {
            refresh(id, (refreshed) => setId({type: refreshed, payload: refreshed}), onResponse);
        }
    }, [history, id, localStorage]);


    const prepConfig = ({config}) => {
        return {...config, id, onRefresh: (refreshed) => setId({type: refreshed, payload: refreshed})};
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
