import {apiConfig} from "../api/apiUtil";

export const strategySelectSchema = (onChange) => {
    return {
        type: "Strategies",
        id: "loadStrategiesSelect",
        config: apiConfig({url: "/api/user/strategies", method: "get"}, null),
        doDefault: () => null,
        doAction: (selection) => onChange(selection)
    }
}

export const cardSelectSchema = ({onDefault, onChange}) => {
    return {
        type: "Cards",
        id: "loadCardsSelect",
        config: apiConfig({url: "/api/user/cards", method: "get"}, null),
        doDefault: () => onDefault(),
        doAction: (selection) => onChange(selection)
    }

}