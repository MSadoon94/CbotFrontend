import {apiConfig} from "../api/apiUtil";

export const strategySelectSchema = (onChange) => {
    return {
        type: "Strategies",
        id: "loadStrategiesSelect",
        config: apiConfig({url: "/user/strategies", method: "get"}, null),
        doDefault: () => null,
        doAction: (selection) => onChange(selection)
    }

}