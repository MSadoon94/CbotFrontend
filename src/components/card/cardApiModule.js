import {apiConfig} from "../api/apiUtil";
import {load, save, validation} from "../api/responseTemplates";

export const cardIds = {
    cardPassResponse: "cardPassResponse",
    cardResponse: "cardResponse",
    allCardsResponse: "allCardsResponse",
    saveCardResponse: "saveCardResponse"
}

export const saveCardApiModule = (card) => {
    return {
        config: apiConfig({url: "/user/card", method: "post"}, card),
        templates: save("Card")
    }
}

export const loadCardApiModule = (cardName) => {
    return {
        config: apiConfig({url: `/user/card/${cardName}`, method: "get"}),
        templates: load("Card")
    }
}

export const cardPasswordApiModule = (cardData) => {
    return {
        config: apiConfig({url: "/user/card-password", method: "post"}, cardData),
        templates: validation("Card Password")
    }
}