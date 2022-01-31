import {apiConfig, apiHandler} from "../api/apiUtil";
import {load, validation} from "../api/responseTemplates";

export const cardIds = {
    passwordResponse: "passwordResponse",
    cardResponse: "cardResponse",
    allCardsResponse: "allCardsResponse"
}

export const loadCardApiModule = (cardName, actions) => {
    return {
        config: apiConfig({url: `/api/user/card/${cardName}`, method: "get"}),
        handler: apiHandler(load("Card"), actions),
    }
}

export const cardPasswordApiModule = (cardData, actions) => {
    return {
        config: apiConfig({url: "/api/user/card-password", method: "post"}, cardData),
        handler: apiHandler(validation("Card Password"), actions)
    }
}