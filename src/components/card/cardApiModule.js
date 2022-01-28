import {apiConfig, apiHandler} from "../api/apiUtil";
import {load, save} from "../api/responseTemplates";

export const saveCard = (card, apiControl) => {
    return {
        id: "saveCardResponse",
        config: apiConfig({url: "api/user/card", method: "post"}, card),
        templates: save("Card"),
        isHidden: false,
        apiControl
    }
}

export const loadCard = (cardName, onComplete, apiControl) => {
    let actions = {
        onComplete
    }

    return {
        id: "loadCardResponse",
        config: apiConfig({url: `/api/user/card/${cardName}`, method: "get"}),
        handler: apiHandler(load("Card"), actions),
        templates: load("Card"),
        isHidden: false,
        actions,
        apiControl

    }
}