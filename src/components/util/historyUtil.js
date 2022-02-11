import {createBrowserHistory, createMemoryHistory} from "history";

const isTest = process.env.NODE_ENV === "test";

export const urls = {
    home: "home",
    start: "start",
    index: "/"
}

export const appHistory = isTest
    ? createMemoryHistory({initialEntries: [urls.home, urls.start, urls.index]})
    : createBrowserHistory();
