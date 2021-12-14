import {apiConfig} from "../api/apiUtil";
import {loadGroup, save} from "../api/responseTemplates";

export const loadStrategiesModule = {
    id: "loadStrategiesRequest",
    config: apiConfig({url: "/api/load-strategies", method: "get"}, null),
    templates: loadGroup("Strategies"),
}

export const saveStrategyModule = (strategyState) => {
    return {
        id: "saveModal",
        config: apiConfig({url: "/api/save-strategy", method: "post"}, strategyState),
        templates: save("Strategy")
    }
}

