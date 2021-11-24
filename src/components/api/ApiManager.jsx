import {createContext, useEffect, useReducer, useRef, useState} from "react";
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
            localStorage.setItem("isLoggedIn", newId.isLoggedIn);
            break;
        case "logout":
        default:
            newId = initialId;
            localStorage.setItem("isLoggedIn", false);
            break;
    }
    return newId;
};

export const ApiManager = ({children, userId}) => {
    const history = useHistory();
    const [requests, setRequests] = useState([]);
    const [id, setId] = useReducer(idReducer, userId);

    const doRequest = async (request, remaining) => {
        let {config, handler} = prepRequest(request);
        await apiRequest(config, handler)
            .finally(() => {
                handler.isResponseReady = true;
                setRequests(remaining);
            });
    };

    useEffect(() => {
        if (requests.length !== 0) {
            let [request, ...rest] = requests;
            doRequest(request, rest);
        }
    },[doRequest, requests]);

  useEffect(() => {
        handlePageReload();
    },[]);

  const handlePageReload = () => {
      let onResponse = {
          success: () => {
              history.push("/home")
              localStorage.setItem("isLoggedIn", true)
          },
          fail: () => {
              history.push("/start")
              localStorage.setItem("isLoggedIn", false);
          }
      }
      if (!(localStorage.getItem("isLoggedIn")) || (localStorage.getItem("isLoggedIn") === "false")) {
          refresh(id, (refreshed) => setId({type: refreshed, payload: refreshed}), onResponse);
      }
  }

    const prepRequest = ({config, handler}) => {
        config = {...config, id};
        handler.onRefresh = {
            success: (refreshed) => {
                setId({type: refreshed, payload: refreshed})
                localStorage.setItem("isLoggedIn", true)
            },
            fail: (refreshed) => {
                setId({type: refreshed, payload: refreshed});
                localStorage.setItem("isLoggedIn", false);
                if(history.location.pathname === "/home"){
                    alert(handler.output.message);
                    history.push( "/start");
                }
            }
        }

        return {config, handler};
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
