import {apiConfig} from "../components/api/apiUtil";
import {loadGroup} from "../components/api/responseTemplates";

export const mockCardsApiModule = {
    id: "loadCardsRequest",
    config: apiConfig({url: "/api/load-cards", method: "get"}, null),
    templates: loadGroup("Cards")
}