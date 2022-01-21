import {render, screen, waitFor} from "@testing-library/react";
import {CheckboxWidget} from "./CheckboxWidget";
import {mockData, mockId} from "../../mocks/mockData";
import {loadStrategiesModule} from "../strategy/strategyApiModule";
import {ApiManager} from "../api/ApiManager";
import userEvent from "@testing-library/user-event";

let isStale = false;

let mockStrategies = {...mockData.strategies};

let checkedOptions;

let onRequest = {
    isReady: false, getRequest: (checked) => checkedOptions = checked
}

jest.mock('react-router-dom', () => ({
    useHistory: () => ({push: jest.fn(),})
}))

beforeEach(() => {
    isStale = false;
    mockData.strategies = {};
    checkedOptions = {};
})


test("should return strategy checkboxes on load", async () => {
    cleanRender();
    mockData.strategies = mockStrategies;
    await waitFor(() => expect(screen.getAllByRole("checkbox").length).toBe(2));
})

test("should send request for options when is stale", async () => {
    cleanRender();
    mockData.strategies = mockStrategies;
    isStale = true

    await waitFor(() => expect(screen.getAllByRole("checkbox").length).toBe(2));
})

test("should return checked options to parent", async () => {
    cleanRender();

    mockData.strategies = mockStrategies;

    await waitFor(() => {
        userEvent.click(screen.getByRole("checkbox", {name: mockStrategies.MockStrategy1.strategyName}));
        onRequest.isReady = true;
        expect(checkedOptions).toContain(mockStrategies.MockStrategy1.strategyName);
    });

})

/* If the render function goes in the beforeEach section, the same document.body is used for each test and the previous
*   results will fail the next test. More details:
*   https://stackoverflow.com/questions/57098027/react-testing-library-cleanup-not-working-in-jests-describe-bocks */

const cleanRender = () => {
    render(
        <ApiManager userId={mockId}>
            <CheckboxWidget type={"strategies"}
                            apiModule={loadStrategiesModule}
                            isStale={() => isStale}
                            onRequest={() => onRequest}
            />
        </ApiManager>)
}