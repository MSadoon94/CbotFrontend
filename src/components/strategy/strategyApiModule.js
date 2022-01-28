import {apiConfig, apiHandler} from "../api/apiUtil";
import {load, loadGroup, save} from "../api/responseTemplates";

export const strategyIds = {
    saveStrategy: "saveStrategyResponse",
    loadStrategies: "loadStrategiesResponse",
    loadStrategy: "loadStrategyResponse"
}

export const loadStrategiesModule = {
    id: "loadStrategiesRequest",
    config: apiConfig({url: "/api/load-strategies", method: "get"}, null),
    templates: loadGroup("Strategies"),
}

export const loadStrategiesModule2 = (actions) => {
    return {
        config: apiConfig({url: "/api/load-strategies", method: "get"}, null),
        handler: apiHandler(loadGroup("Strategies"), actions)
    }
}

export const loadStrategyModule = (strategyName, actions) => {
    return{
        config: apiConfig({url: `/api/user/strategy/${strategyName}`, method: "get"}),
        handler: apiHandler(load("Strategy"), actions)
    }
}

export const saveStrategyModule = (strategy, actions) => {
    return {
        config: apiConfig({url: "/api/user/strategy", method: "post"}, strategy),
        handler: apiHandler(save("Strategy"), actions),
        actions
    }
}

