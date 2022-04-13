import {websocketMappings} from "../components/api/websocketMappings";

export const mockData = {
    assetPair: {base: "BTC", quote: "USD"},
    saveStrategy: {strategy: {}},
    card: {cardName: "mockCard1", balances: {currency: "ZUSD", amount: 100}},
    user: {username: "user", password: "pass", authority: "USER"},
    formattedCard: {cardName: "mockCard1", balances: [[{currency: "ZUSD", amount: 100}]], isHidden: false},
    cards: {
        "mockCard1": {cardName: "mockCard1", balances: {"ZUSD": 100}},
        "mockCard2": {cardName: "mockCard2", balances: {"ZUSD": 150}}
    },
    strategies: {
        "MockStrategy1": {strategyName: "MockStrategy1"},
        "MockStrategy2": {strategyName: "MockStrategy2"}
    },
    strategy: {
        name: "MockStrategy1",
        base: "USD",
        quote: "BTC",
        stopLoss: "100",
        maxPosition: "100",
        targetProfit: "100",
        movingStopLoss: "100",
        maxLoss: "100",
        entry: "100"
    },

    trade: {
        id: "KRAKEN1BTC/USD100Long",
        exchange: "KRAKEN",
        status: "Searching",
        pair: "BTC/USD",
        allNames: ["BTC/USD", "BTCUSD"],
        targetPrice: "100",
        currentPrice: "1",
        entryPercentage: "5",
        fees: {},
        type: "LONG"
    },

    credentials: {
        exchange: "kraken",
        account: "mockAccount",
        password: "mockPassword"
    }
};

export const mockId = {
    username: "mockUser",
    expiration: new Date(Date.now() + 10000).toUTCString(),
    isLoggedIn: true
};

export const mockStatus = () => {
    return {
        isActive: true,
        activeStrategies: Object.keys(mockData.strategies)
    }
}

export const messages = () => {
    let wsMessages = {...websocketMappings};
    wsMessages["/topic/strategies/names"] = {payload: Object.keys(mockData.strategies), headers: {}}
    wsMessages["/app/strategies/names"] = {payload: Object.keys(mockData.strategies), headers: {}}
    return wsMessages;
}

export const wsClient = (expectedMessage) => {
    return {
        current: {
            sendMessage: (endpoint, message) => expectedMessage({endpoint, message})
        }
    }
}