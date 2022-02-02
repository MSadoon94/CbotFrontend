import {apiConfig, apiHandler} from "../api/apiUtil";
import {load, loadGroup, save, validation} from "../api/responseTemplates";

export const strategyIds = {
    saveStrategy: "saveStrategyResponse",
    loadStrategies: "loadStrategiesResponse",
    loadStrategy: "loadStrategyResponse",
    getAssetPairData: "getAssetPairDataResponse"
}

export const loadStrategiesModule = (actions) => {
    return {
        config: apiConfig({url: "/api/user/strategies", method: "get"}, null),
        handler: apiHandler(loadGroup("Strategies"), actions)
    }
}

export const loadStrategyModule = (strategyName, actions) => {
    return {
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

export const getAssetPair = (assetPair) => {
    return {
        config: apiConfig({url: `/api/asset-pair/${assetPair}/kraken`, method: "get"}, null),
        handler: apiHandler(validation(assetPair))
    }
}

