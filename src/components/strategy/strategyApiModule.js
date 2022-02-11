import {apiConfig} from "../api/apiUtil";
import {load, loadGroup, save, validation} from "../api/responseTemplates";

export const strategyIds = {
    saveStrategy: "saveStrategyResponse",
    loadStrategies: "loadStrategiesResponse",
    loadStrategy: "loadStrategyResponse",
    getAssetPairData: "getAssetPairDataResponse"
}

export const loadStrategiesModule = () => {
    return {
        config: apiConfig({url: "/api/user/strategies", method: "get"}, null),
        templates: loadGroup("Strategies")
    }
}

export const loadStrategyModule = (strategyName) => {
    return {
        config: apiConfig({url: `/api/user/strategy/${strategyName}`, method: "get"}),
        templates: load("Strategy")
    }
}

export const saveStrategyModule = (strategy) => {
    return {
        config: apiConfig({url: "/api/user/strategy", method: "post"}, strategy),
        templates: save("Strategy")
    }
}

export const getAssetPair = (assetPair) => {
    return {
        config: apiConfig({url: `/api/asset-pair/${assetPair}/kraken`, method: "get"}, null),
        templates: validation(assetPair)
    }
}

