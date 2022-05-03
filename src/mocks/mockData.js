import {websocketMappings} from "../components/api/websocketMappings";

export const mockData = {
    assetPair: {base: "BTC", quote: "USD"},
    saveStrategy: {strategy: {}},
    exchange: {name: "exchange1", balances: {currency: "ZUSD", amount: 100}},
    user: {username: "user", password: "pass", authority: "USER"},
    formattedExchange: {name: "exchange1", balances: [[{currency: "ZUSD", amount: 100}]], isHidden: false},
    exchanges: {
        "exchange1": {name: "exchange1", balances: {"ZUSD": 100}},
        "exchange2": {name: "exchange2", balances: {"ZUSD": 150}}
    },
    strategies: {
        "MockStrategy1": {name: "MockStrategy1", isActive: true},
        "MockStrategy2": {name: "MockStrategy2", isActive: false}
    },
    strategy: {
        isActive: false,
        exchange: "KRAKEN",
        type: "long",
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
        strategyName: "Strategy1",
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
    let mockStrategy1 = mockData.strategies.MockStrategy1.name;
    let mockStrategy2 = mockData.strategies.MockStrategy2.name;
    let wsMessages = {...websocketMappings};
    wsMessages["/app/strategies/details"] = Object.values(mockData.strategies)
        .map(strategy => ({name: strategy.name, isActive: strategy.isActive}));
    wsMessages["/topic/strategies/details"] = Object.values(mockData.strategies)
        .map(strategy => ({name: strategy.name, isActive: strategy.isActive}));
    wsMessages[`/topic/${mockStrategy1}/true`] = {mockStrategy1: true};
    wsMessages[`/topic/${mockStrategy2}/false`] = {mockStrategy1: false};
    wsMessages[`/topic/${mockStrategy1}/create-trade`] = {id: "mockTradeId", status: mockData.trade.status};
    wsMessages["/app/trades"] = {[mockData.trade.id]: mockData.trade};
    wsMessages["/topic/trades"] = {[mockData.trade.id]: mockData.trade};
    wsMessages["/topic/asset-pairs"] = {error: []}
    wsMessages["/topic/add-credentials"] = "KRAKEN added successfully."
    return wsMessages;
}

export const wsClient = (expectedMessage) => {
    return {
        current: {
            sendMessage: (endpoint, message) => expectedMessage({endpoint, message})
        }
    }
}