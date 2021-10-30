export const mockData = {
    assetPair: {base: "BTC", quote: "USD"},
    saveStrategy: {strategy: {}},
    card: {account: "account", password: "password", balance: ""},
    user: {username: "user", password: "pass", authority: "USER"},
    singleCard: {cardName: "mockCard1", balances: JSON.stringify([[{"ZUSD": 100}]]), isHidden: false},
    formattedCard: {cardName: "mockCard1", balances: [[{currency: "ZUSD", amount: 100}]], isHidden: false},
    cards: {
        "mockCard1": {cardName: "mockCard1", balances: {"ZUSD": 100}},
        "mockCard2": {cardName: "mockCard2", balances: {"ZUSD": 150}}
    }
};