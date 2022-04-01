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
        config: apiConfig({url: "/user/strategies", method: "get"}, null),
        templates: loadGroup("Strategies")
    }
}

export const loadStrategyModule = (strategyName) => {
    return {
        config: apiConfig({url: `/user/strategy/${strategyName}`, method: "get"}),
        templates: load("Strategy")
    }
}

export const saveStrategyModule = (strategy) => {
    return {
        config: apiConfig({url: "/user/strategy", method: "post"}, strategy),
        templates: save("Strategy")
    }
}

export const getAssetPair = (base, quote, exchange) => {
    return {
        config: apiConfig({url: `/asset-pair/${base}/${quote}/${exchange}`, method: "get"}, null),
        templates: validation(base.concat(quote))
    }
}

