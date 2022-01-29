import {apiConfig} from "../api/apiUtil";

export const strategySelect = (onChange) => {
    return {
        type: "Strategies",
        id: "loadStrategiesSelect",
        config: apiConfig({url: "/api/user/strategies", method: "get"}, null),
        defaultAction: () => null,
        doAction: (selection) => onChange(selection)
    }
}