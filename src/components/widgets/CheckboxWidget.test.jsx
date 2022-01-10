import {render, screen, waitFor} from "@testing-library/react";
import {CheckboxWidget} from "./CheckboxWidget";
import {mockData, mockId} from "../../mocks/mockData";
import {loadStrategiesModule} from "../strategy/strategyApiModule";
import {ApiManager} from "../api/ApiManager";

let isStale = false;

let mockStrategies = {...mockData.strategies};

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

beforeEach(() => {
    mockData.strategies = {};
    render(
        <ApiManager userId={mockId}>
        <CheckboxWidget type={"strategies"}
                        apiModule={loadStrategiesModule}
                        isStale={() => isStale}
        />
        </ApiManager>)
})

afterEach(() => {
    isStale = false;
})

test("should return strategy checkboxes on load", async () => {
    mockData.strategies = mockStrategies;
    await waitFor(() => expect(screen.getAllByRole("checkbox").length).toBe(2));
})

test("should send request for options when is stale", async () => {
    mockData.strategies = mockStrategies;
    isStale = true

    await waitFor(() => expect(screen.getAllByRole("checkbox").length).toBe(2));
})
